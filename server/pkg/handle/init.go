package handle

import (
	"encoding/json"
	"fmt"
	"github.com/tiyee/uploader/pkg/controller/uploader"
	"github.com/valyala/fasthttp"
	"net/http"
	"time"
)

type JsonRet struct {
	Error int         `json:"error"`
	Msg   string      `json:"msg"`
	Data  interface{} `json:"data"`
}
type RetResult struct {
	UploadID string                `json:"upload_id"`
	Status   int8                  `json:"status"`
	Url      string                `json:"url"`
	Chunks   []*uploader.ChunkETag `json:"chunks"`
}

func ret(code int, msg string, data interface{}) []byte {
	d := &JsonRet{
		Error: code,
		Msg:   msg,
		Data:  data,
	}
	if bs, err := json.Marshal(d); err == nil {
		return bs
	} else {
		return []byte(err.Error())
	}
}
func Init(c *fasthttp.RequestCtx) {
	size := c.QueryArgs().GetUintOrZero("size")
	chunkSize := c.QueryArgs().GetUintOrZero("chunk_size")
	digest := c.QueryArgs().Peek("digest")
	chunk := c.PostBody()
	if size*chunkSize < 1 || len(digest) != 32 || len(chunk) < 1 {
		c.Success("application/json", ret(1, "数据不合法", size))
		return
	}
	mime := http.DetectContentType(chunk)
	ext := uploader.Ext(mime)
	if ext == "" {
		c.Success("application/json", ret(1, "文件类型不合法", size))
		return
	}
	fmt.Println(string(digest), size, chunkSize, http.DetectContentType(chunk))
	c.PostBody()
	fn := func(m *uploader.Meta) {
		m.ChunkSize = chunkSize
		m.Object = "uploader/" + time.Now().Format("20060102150405") + "." + ext
		m.Digest = string(digest)
		m.Size = size
		m.ContentType = mime
	}
	upload, err := uploader.FromDigest(c, uploader.OSS, string(digest), fn)
	//upload, err := uploader.NewMeta(c, uploader.OSS, fn)
	if err != nil {
		c.Success("application/json", []byte(err.Error()))
	}
	status := upload.Touch()
	if status == uploader.FulfilledStatus {
		data := &RetResult{
			Status: upload.Status,
			Url:    upload.Url(),
			Chunks: []*uploader.ChunkETag{},
		}
		c.Success("application/json", ret(0, "ok", data))
		return
	}
	if status == uploader.PendingStatus {
		data := &RetResult{
			UploadID: upload.UploadID,
			Status:   upload.Status,
			Url:      "",
			Chunks:   upload.Pending(),
		}
		c.Success("application/json", ret(0, "ok", data))
		return
	}
	err = upload.Init()
	if err != nil {
		c.Success("application/json", ret(1, err.Error(), 1))
		return
	}
	data := &RetResult{
		UploadID: upload.UploadID,
		Status:   upload.Status,
		Url:      "",
		Chunks:   upload.Pending(),
	}
	c.Success("application/json", ret(0, "ok", data))
	return
}
