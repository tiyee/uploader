package handle

import (
	"encoding/json"
	"fmt"
	"github.com/tiyee/uploader/pkg/controller/uploader"
	"github.com/valyala/fasthttp"
)

func Merge(c *fasthttp.RequestCtx) {
	digest := c.QueryArgs().Peek("digest")
	uploadID := c.QueryArgs().Peek("upload_id")
	chunks := c.PostBody()
	var partials []uploader.ChunkETag
	if err := json.Unmarshal(chunks, &partials); err != nil {
		c.Success("application/json", ret(11, err.Error(), string(uploadID)))
		return
	}
	meta, err := uploader.FromUploadID(c, string(uploadID))
	if err != nil {
		c.Success("application/json", ret(11, err.Error(), string(uploadID)))
		return
	}
	if meta.Digest != string(digest) {
		fmt.Println("digest do not match")
	}
	err = meta.Merge(partials)
	if err != nil {
		c.Success("application/json", ret(11, err.Error(), string(uploadID)))
		return
	}
	data := &RetResult{
		UploadID: meta.UploadID,
		Status:   meta.Status,
		Url:      meta.Url(),
		Chunks:   meta.Pending(),
	}
	c.Success("application/json", ret(0, "ok", data))
}
