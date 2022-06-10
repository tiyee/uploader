package main

import (
	"fmt"
	"github.com/tiyee/uploader/pkg/component"
	"github.com/tiyee/uploader/pkg/handle"
	"github.com/valyala/fasthttp"
	"os"
)

func main() {
	// the corresponding fasthttp code
	m := func(ctx *fasthttp.RequestCtx) {
		switch string(ctx.Path()) {
		case "/init":
			handle.Init(ctx)
		case "/upload":
			handle.Upload(ctx)
		case "/merge":
			handle.Merge(ctx)
		default:
			ctx.Error("not found", fasthttp.StatusNotFound)
		}
	}
	if err := component.InitBigCache(); err != nil {
		fmt.Println("init bigCache err:", err.Error())
		os.Exit(1)
	}
	if err := fasthttp.ListenAndServe("127.0.0.1:3001", m); err != nil {
		fmt.Println(err.Error())
	}
}
