/** @format */

import {IFileHandle, IJsonRet, IRequest, Uploader} from 'uploader'
import SparkMD5 from 'spark-md5'
import {extend, IRequestOptions, HttpMethod} from 'request'
import {IInitRet, IContext, IUploadPartRet} from 'uploader'
class WebFile implements IFileHandle {
    readonly file: File
    constructor(file: File) {
        this.file = file
    }
    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void {
        const chunk = Blob.prototype.slice.call(this.file, start, start + length)
        const chunkReader = new FileReader()
        chunkReader.onload = (e: ProgressEvent<FileReader>) => {
            if (e && e.target && e.target.readyState === FileReader.DONE) {
                success(e.target.result as ArrayBuffer)
            }
        }
        chunkReader.onerror = (e: ProgressEvent<FileReader>) => {
            console.log(e)
            fail(Error('fileReader error'))
        }
        chunkReader.onerror = (e: ProgressEvent<FileReader>) => {
            console.log(e)
        }
        chunkReader.readAsArrayBuffer(chunk)
    }
    digest(success: (params: string) => void, fail: (e: Error) => void): void {
        const blobSlice = File.prototype.slice,
            chunkSize = 2097152, // Read in chunks of 2MB
            chunks = Math.ceil(this.file.size / chunkSize),
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader()
        let currentChunk = 0
        fileReader.onload = function (e) {
            console.log('read chunk nr', currentChunk + 1, 'of', chunks)
            if (e && e.target && e.target.readyState === FileReader.DONE) {
                spark.append(e.target.result as ArrayBuffer) // Append array buffer
                currentChunk++

                if (currentChunk < chunks) {
                    loadNext()
                } else {
                    console.log('finished loading')
                    const hexHash = spark.end()
                    success(hexHash)
                    // console.info('computed hash', spark.end()) // Compute hash
                }
            } else {
                fail(Error('hash error'))
            }
        }

        fileReader.onerror = function () {
            console.warn('oops, something went wrong.')
        }

        const loadNext = () => {
            const start = currentChunk * chunkSize,
                end = start + chunkSize >= this.size() ? this.size() : start + chunkSize

            fileReader.readAsArrayBuffer(blobSlice.call(this.file, start, end))
        }

        loadNext()
    }
    size(): number {
        return this.file.size
    }
}
class WebRequest implements IRequest {
    async request(method: HttpMethod, url: string, opts: IRequestOptions): Promise<any> {
        const req = extend(opts)
        return req._request(method, url, opts).then((resp: Response) => {
            return resp.json()
        })
    }
    initRequest(
        ctx: IContext,
        params: URLSearchParams,
        hexHash: ArrayBuffer,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {touchUrl, headers, withCredentials} = ctx
        const opts = {credentials: withCredentials, params, headers, data: hexHash}
        this.request('post', touchUrl, opts)
            .then((data: IJsonRet<IInitRet>) => {
                resolve(data.data)
            })
            .catch((e: Error) => {
                console.log(e)
                fail(e)
            })
    }
    chunkRequest(
        ctx: IContext,
        params: URLSearchParams,
        chunk: ArrayBuffer,
        resolve: (res: IUploadPartRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {uploadUrl, headers, withCredentials} = ctx
        const opts = {credentials: withCredentials, params, headers, data: chunk}
        this.request('post', uploadUrl, opts)
            .then((data: IJsonRet<IUploadPartRet>) => {
                resolve(data.data)
            })
            .catch((e: Error) => {
                console.log(e)
                fail(e)
            })
    }
    mergeRequest(
        ctx: IContext,
        params: URLSearchParams,
        chunks: string,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void {
        const {mergeUrl, headers, withCredentials} = ctx
        const opts = {credentials: withCredentials, params, headers, data: chunks}
        this.request('post', mergeUrl, opts)
            .then((data: IJsonRet<IInitRet>) => {
                resolve(data.data)
            })
            .catch((e: Error) => {
                console.log(e)
                fail(e)
            })
    }
}
const uploader = (ctx: IContext, f: File) => {
    return new Uploader<WebFile, WebRequest, URLSearchParams>(ctx, new WebFile(f), new WebRequest(), URLSearchParams)
}
export default uploader
