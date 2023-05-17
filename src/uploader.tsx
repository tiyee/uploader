/** @format */

import SparkMD5 from 'spark-md5'
export interface IFileHandle {
    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void
    digest(success: (params: string) => void, fail: (e: Error) => void): void
    size(): number
}
export interface IRequest {
    initRequest(
        ctx: IContext,
        params: IURLSearchParams,
        hexHash: ArrayBuffer,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void
    chunkRequest(
        ctx: IContext,
        params: IURLSearchParams,
        chunk: ArrayBuffer,
        resolve: (res: IUploadPartRet) => void,
        fail: (e: Error) => void,
    ): void
    mergeRequest(
        ctx: IContext,
        params: IURLSearchParams,
        chunks: string,
        resolve: (res: IInitRet) => void,
        fail: (e: Error) => void,
    ): void
}

export interface IURLSearchParams {
    set(k: string, v: string): void
    toString(): string
}

interface IProgress {
    uploadedSize: number
    totalSize: number
}
export const enum Event {
    Progress = 'progress',
    Retry = 'retry',
    Success = 'success',
    Fail = 'fail',
    Complete = 'complete',
}
export interface IContext {
    maxConcurrency: number
    totalSize: number
    chunkSize: number
    testChunks: boolean
    touchUrl: string
    uploadUrl: string
    mergeUrl: string
    verfiyUrl: string
    headers: Record<string, string>
    withCredentials: RequestCredentials
}
const enum UploadStage {
    InitializeStatus = 0,
    PendingStatus = 1,
    FulfilledStatus = 2,
    RejectStatus = 3,
}
interface IChunk {
    index: number
    etag: string
}
export interface IInitRet {
    status: UploadStage
    upload_id: string
    chunks: Array<IChunk>
    url: string
}
export interface IJsonRet<T> {
    error: number
    msg: string
    data: T
}

export interface IUploadPartRet {
    etag: string
    index: number
    upload_id: string
}

export class Uploader<F extends IFileHandle, R extends IRequest, USP extends IURLSearchParams> {
    readonly f: F
    readonly r: R
    private ctx: IContext
    private chunks: IChunk[] = []
    private readonly totalSize: number
    private readonly totalChunks: number
    private readonly chunksize: number
    private uploadedSize = 0
    private digest = ''
    private tasks: Array<number>
    private readonly maxConcurrency: number
    constructor(ctx: IContext, f: F, r: R, private uspType: new () => USP) {
        this.ctx = ctx
        this.f = f
        this.r = r
        this.totalSize = this.f.size()
        this.chunksize = this.ctx.chunkSize || 2097152 //defalut 2M
        this.totalChunks = Math.ceil(this.totalSize / this.chunksize)
        this.maxConcurrency = Math.min(this.totalChunks, this.ctx.maxConcurrency || 5)
        this.tasks = Array.from({length: this.totalChunks}, (_, index) => {
            return index
        })
    }
    getNew(): USP {
        return new this.uspType()
    }
    private init = (cb: (x: IInitRet) => void) => {
        const fn = (hexHash: string) => {
            console.log(hexHash)
            this.digest = hexHash

            this.f.read(
                0,
                200,
                (chunk: ArrayBuffer) => {
                    const params: IURLSearchParams = this.getNew()
                    params.set('size', this.f.size().toString())
                    params.set('digest', hexHash)
                    params.set('chunk_size', this.chunksize.toString())
                    params.set('ts', Date.now().toString())
                    this.r.initRequest(this.ctx, params, chunk, cb, this.fail)
                },
                e => {
                    console.log(e)
                },
            )
        }

        this.f.digest(fn, (e: Error) => {
            console.log(e)
        })
    }
    private uploadChunk = (upload_id: string, processor: number, idx: number, chunk: ArrayBuffer, cb: () => void) => {
        const _this = this
        const params: IURLSearchParams = this.getNew()

        params.set('upload_id', upload_id)
        params.set('index', idx.toString())

        const decoder = new TextDecoder('utf-8')
        const s = decoder.decode(chunk)

        params.set('digest', SparkMD5.hash(s))
        this.r.chunkRequest(
            this.ctx,
            params,
            chunk,
            (d: IUploadPartRet) => {
                console.log(d)
                _this.chunks.push({index: idx, etag: d.etag})
                if (idx < _this.totalChunks - 1) {
                    _this.uploadedSize += _this.chunksize
                } else {
                    _this.uploadedSize += _this.totalSize - _this.chunksize * (_this.totalChunks - 1)
                }
                _this.progress({uploadedSize: _this.uploadedSize, totalSize: _this.totalSize})
                cb()
            },
            this.fail,
        )
    }
    private upload(d: IInitRet) {
        const _this = this
        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]
            if (chunk.index < this.totalChunks - 1) {
                this.uploadedSize += this.chunksize
            } else {
                this.uploadedSize += this.totalSize - this.chunksize * (this.totalChunks - 1)
            }
            this.progress({uploadedSize: this.uploadedSize, totalSize: this.totalSize})
        }
        Promise.all(
            Array.from({length: this.maxConcurrency}, (_, index) => {
                return new Promise(resolve => {
                    const proc = () => {
                        const task = this.tasks.shift()
                        if (task === undefined) {
                            resolve(index)
                            return
                        }
                        const start = task * this.chunksize
                        const end = start + this.chunksize >= this.totalSize ? this.totalSize : start + this.chunksize
                        const fn = (chunk: ArrayBuffer) => {
                            _this.uploadChunk(d.upload_id, index, task, chunk, proc)
                        }
                        _this.f.read(start, end - start, fn, e => {
                            console.log(e)
                        })
                    }
                    proc()
                })
            }),
        ).then((values: any) => {
            console.log(values)
            this.merge(d.upload_id)
        })
    }
    private success(d: IInitRet) {
        console.log('success', d)
        this.complete(d)
    }
    private fail(e: Error) {
        console.log(e)
    }
    private progress(e: IProgress) {
        console.log('progress', e)
    }
    private complete(e: IInitRet) {
        console.log(e)
    }
    private merge(upload_id: string) {
        const params: IURLSearchParams = this.getNew()
        params.set('upload_id', upload_id)
        params.set('digest', this.digest)

        const chunks = JSON.stringify(this.chunks)
        const _this = this
        this.r.mergeRequest(
            this.ctx,
            params,
            chunks,
            (d: IInitRet) => {
                _this.success(d)
            },
            this.fail,
        )
    }
    public on(event: Event, callback: (e: any) => void) {
        switch (event) {
            case Event.Progress:
                this.progress = callback
                break
            case Event.Retry:
                break
            case Event.Success:
                this.success = callback
                break
            case Event.Fail:
                this.fail = callback
                break
            case Event.Complete:
                this.complete = callback
                break
        }
    }
    public run() {
        const fn = (d: IInitRet): void => {
            switch (d.status) {
                case UploadStage.InitializeStatus:
                    this.upload(d)
                case UploadStage.PendingStatus:
                    this.chunks = d.chunks
                    this.upload(d)
                    break
                case UploadStage.FulfilledStatus:
                    this.success(d)
            }
            console.log(d.upload_id)
        }
        this.init(fn)
    }
}
