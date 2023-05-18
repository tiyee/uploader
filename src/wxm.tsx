/** @format */

import {IFileHandle, IJsonRet, IRequest, IURLSearchParams, Uploader} from 'uploader'
import SparkMD5 from 'spark-md5'
import {IInitRet, IContext, IUploadPartRet} from 'uploader'

class URLSearchParams implements IURLSearchParams {
    private data: Record<string, Array<string>>
    constructor() {
        this.data = {}
    }
    set(k: string, v: string): void {
        this.data[k] = [v]
    }
    append(k: string, v: string) {
        if (k in this.data) {
            this.data[k].push(v)
        } else {
            this.data[k] = [v]
        }
    }
    delete(k: string) {
        if (k in this.data) {
            delete this.data[k]
        }
    }
    toString(): string {
        const arr = new Array<string>()
        for (const k in this.data) {
            for (const v of this.data[k]) {
                arr.push(`${k}=${v}`)
            }
        }
        return arr.join('&')
    }
}
class WxmFile implements IFileHandle {
    readonly fsm: WechatMiniprogram.FileSystemManager
    readonly filePath: string
    private _size: number
    constructor(fsm: WechatMiniprogram.FileSystemManager, filePath: string, size: number) {
        this.fsm = fsm
        this.filePath = filePath
        this._size = size
    }
    size(): number {
        return this._size
    }

    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void {
        const {filePath, fsm} = this
        fsm.readFile({
            filePath,
            position: start,
            length,
            success(res) {
                success(res.data as ArrayBuffer)
            },
            fail(e: WechatMiniprogram.ReadFileFailCallbackResult) {
                fail(Error(e.errMsg))
            },
        })
    }
    _digest(success: (params: string) => void, fail: (e: Error) => void) {
        const {filePath, _size: totalSize, fsm} = this,
            chunkSize = 2014 * 1024, // Read in chunks of 1MB
            chunks = Math.ceil(totalSize / chunkSize),
            spark = new SparkMD5.ArrayBuffer()
        const callback = (i: number) => {
            console.log(chunkSize, chunks, i)
            if (i === chunks) {
                const digest = spark.end()
                spark.destroy()
                success(digest)
                return
            }
            const position = i * chunkSize
            const length = Math.min(totalSize - position, chunkSize)
            fsm.readFile({
                filePath,
                position,
                length,
                success(res) {
                    console.log(res.data)
                    spark.append(res.data as ArrayBuffer)
                    callback(++i)
                },
                fail(res: WechatMiniprogram.ReadFileFailCallbackResult) {
                    fail(Error(res.errMsg))
                },
            })
        }
        callback(0)
    }
    digest(success: (params: string) => void, fail: (e: Error) => void): void {
        this._digest(success, fail)
    }
}
class WxmRequest implements IRequest {
    initRequest(
        ctx: IContext,
        params: URLSearchParams,
        hexHash: ArrayBuffer,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {touchUrl} = ctx
        wx.request({
            url: touchUrl + '?' + params.toString(),
            data: hexHash,
            dataType: 'json',
            method: 'POST',
            header: {
                'content-type': 'application/octet-stream',
            },
            success(resp) {
                console.log(resp.data)
                const {data} = resp.data as IJsonRet<IInitRet>
                resolve(data as IInitRet)
            },
            fail(e: WechatMiniprogram.GeneralCallbackResult) {
                fail(Error(e.errMsg))
            },
        })
    }
    chunkRequest(
        ctx: IContext,
        params: URLSearchParams,
        chunk: ArrayBuffer,
        resolve: (res: IUploadPartRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {uploadUrl} = ctx
        wx.request({
            url: uploadUrl + '?' + params.toString(),
            data: chunk,
            dataType: 'json',
            method: 'POST',
            header: {
                'content-type': 'application/octet-stream',
            },
            success(resp) {
                console.log(resp.data)
                const {data} = resp.data as IJsonRet<IUploadPartRet>
                resolve(data as IUploadPartRet)
            },
            fail(e: WechatMiniprogram.GeneralCallbackResult) {
                fail(Error(e.errMsg))
            },
        })
    }
    mergeRequest(
        ctx: IContext,
        params: URLSearchParams,
        chunks: string,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {mergeUrl} = ctx
        wx.request({
            url: mergeUrl + '?' + params.toString(),
            data: chunks,
            dataType: 'json',
            method: 'POST',
            header: {
                'content-type': 'application/octet-stream',
            },
            success(resp) {
                console.log(resp.data)
                const {data} = resp.data as IJsonRet<IInitRet>
                resolve(data as IInitRet)
            },
            fail(e: WechatMiniprogram.GeneralCallbackResult) {
                fail(Error(e.errMsg))
            },
        })
    }
}
const fsm = wx.getFileSystemManager()
const getSize = (filePath: string): Promise<number> => {
    return new Promise(resolve => {
        fsm.getFileInfo({
            filePath,
            success(res) {
                resolve(res.size)
            },
            fail(e: WechatMiniprogram.GetFileInfoFailCallbackResult) {
                throw Error(e.errMsg)
            },
        })
    })
}
const uploader = async (ctx: IContext, filePath: string) => {
    return getSize(filePath).then(n => {
        return new Uploader<WxmFile, WxmRequest, URLSearchParams>(
            ctx,
            new WxmFile(fsm, filePath, n),
            new WxmRequest(),
            URLSearchParams,
        )
    })
}
export default uploader
