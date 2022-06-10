package handle

import (
	"github.com/tiyee/uploader/pkg/controller/uploader"
	"github.com/valyala/fasthttp"
)

type uploadRet struct {
	ETag     string `json:"etag"`
	Index    int    `json:"index"`
	UploadID string `json:"upload_id"`
}

func Upload(c *fasthttp.RequestCtx) {
	index := c.QueryArgs().GetUintOrZero("index")
	uploadID := string(c.QueryArgs().Peek("upload_id"))
	chunk := c.PostBody()
	if index < 0 || len(uploadID) < 1 || len(chunk) < 1 {
		c.Success("application/json", ret(1, "数据不合法", uploadID))
		return
	}
	upload, err := uploader.FromUploadID(c, uploadID)
	if err != nil {
		c.Success("application/json", ret(11, err.Error(), index))
		return
	}
	chunkPart, err := upload.UploadPart(index, chunk)
	if err != nil {
		c.Success("application/json", ret(11, err.Error(), index))
		return
	}
	data := uploadRet{
		ETag:     chunkPart.ETag,
		Index:    index,
		UploadID: uploadID,
	}
	c.Success("application/json", ret(0, "ok", data))
	return

}
