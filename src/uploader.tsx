
import SparkMD5 from 'spark-md5'

function checkStatus(response: Response): Response {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(response.statusText)
        throw error
    }
}
type IRquest = (
    url: string,
    method: 'GET' | 'POST',
    headers: Record<string, string>,
    credentials: RequestCredentials,
    body: Blob | FormData,
    fn: (x: any) => void,
) => void
interface IJsonRet {
    error: number
    msg: string
}

export interface IInitRet {
    status: UploadStage
    upload_id: string
    chunks: Array<IChunk>
    url: string
}
type IRet = {
    data: IInitRet
} & IJsonRet

interface IProgress {
    uploadedSize: number
    totalSize: number
}
interface IUploadPart {
    etag: string
    index: number
    upload_id: string
}
type IUploadPartRet = {
    data: IUploadPart
} & IJsonRet
function httpClient(
    url: string,
    method: 'GET' | 'POST',
    headers: Record<string, string>,
    credentials: RequestCredentials,

    body: Blob | ArrayBuffer | FormData,
    fn: (d: any) => boolean | any,
): void {
    let chain: Promise<Response>
    switch (method) {
        case 'GET':
            chain = fetch(url, {
                credentials,
                method: 'GET',
                headers,
            })
            break
        case 'POST':
            chain = fetch(url, {
                credentials,
                method: 'POST',

                body,
            })
            break
        default:
            throw new Error('undefined method')
    }
    chain
        .then(checkStatus)
        .then((response: Response) => {
            return response.json()
        })
        .then(fn)
        .catch(e => {
            console.log(e)
        })
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
export enum UploadStage {
    InitializeStatus = 0,
    PendingStatus = 1,
    FulfilledStatus = 2,
    RejectStatus = 3,
}
export interface IChunk {
    index: number
    etag: string
}
export enum Event {
    Progress = 'progress',
    Retry = 'retry',
    Success = 'success',
    Fail = 'fail',
    Complete = 'complete',
}
export const defaultRequest = httpClient
type IFileDigest = (obj:Uploader,fn:(digest:string)=>void)=>void
const FileDigest=(obj:Uploader,fn:(digest:string)=>void)=>{
    const blobSlice = File.prototype.slice,
    file = obj.getFile(),
    chunkSize = 2097152, // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
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
            fn(hexHash)
            // console.info('computed hash', spark.end()) // Compute hash
        }
    }
}

fileReader.onerror = function () {
    console.warn('oops, something went wrong.')
}

const loadNext = () => {
    const start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
}

loadNext()
}
export class Uploader {
    private ctx: IContext
    private file: File
    private readonly maxConcurrency :number
    private readonly  totalSize: number
    private uploadedSize = 0
    private readonly  chunksize: number
    private digest = ''
    private fileDigest: IFileDigest
    private request: IRquest = httpClient
    private tasks: Array<number>
    private chunks: IChunk[] = []
    private readonly  totalChunks:number
    constructor(ctx: IContext, file: File) {
        this.ctx = ctx
        this.file = file
        this.totalSize = file.size
        this.chunksize = this.ctx.chunkSize || 2097152 //defalut 2M
        this.ctx.withCredentials = this.ctx.withCredentials||'include'
        this.totalChunks = Math.ceil(this.totalSize / this.chunksize)
        this.maxConcurrency = Math.min(this.totalChunks, this.ctx.maxConcurrency || 5)
        this.tasks = Array.from({length: this.totalChunks}, (_, index) => {
            return index
        })
        
            this.fileDigest=FileDigest
            this.request=httpClient
        
    }
    public getFile(){
        return this.file
    }
    private upload(upload_id: string, processor: number, idx: number, chunk: ArrayBuffer, cb: () => void) {
        const {uploadUrl,  headers,withCredentials} = this.ctx
        const params = new URLSearchParams()
        params.set('upload_id', upload_id)
        params.set('index', idx.toString())
        const blob = new Blob([chunk])
        const _this = this
        blob.text().then(s => {
            params.set('digest', SparkMD5.hash(s))
            this.request(uploadUrl + '?' + params.toString(), 'POST', headers,withCredentials, blob, (d: IUploadPartRet) => {
                if (d.error === 0) {
                    _this.chunks.push({index: idx, etag: d.data.etag})
                    if (idx < _this.totalChunks - 1) {
                        _this.uploadedSize += _this.chunksize
                    } else {
                        _this.uploadedSize += _this.totalSize - _this.chunksize * (_this.totalChunks - 1)
                    }
                    _this.progress({uploadedSize: _this.uploadedSize, totalSize: _this.totalSize})
                }
                cb()
            })
        })
    }
    private touch = (cb: (x: IInitRet) => void) => {
    
        const fn = (hexHash: string) => {
            this.digest = hexHash
            const {touchUrl, headers, withCredentials} = this.ctx
            const chunk = Blob.prototype.slice.call(this.file, 0, 200)
            const params = new URLSearchParams()
            params.set('size', this.file.size.toString())
            params.set('digest', hexHash)
            params.set('chunk_size', this.chunksize.toString())
            params.set('ts', Date.now().toString())
            const resolve = (d: IRet) => {
                cb(d.data)
            }
            this.request(touchUrl + '?' + params.toString(), 'POST', headers,withCredentials, chunk, resolve)
        }
        this.fileDigest(this,fn)

    
    }

    private merge(upload_id: string) {
        const {mergeUrl, headers,withCredentials} = this.ctx
        const params = new URLSearchParams()
        params.set('upload_id', upload_id)
        params.set('digest', this.digest)

        const chunks = JSON.stringify(this.chunks)
        const blob = new Blob([chunks])
        const _this = this
        this.request(mergeUrl + '?' + params.toString(), 'POST', headers,withCredentials, blob, (d: IRet) => {
            _this.success(d.data)
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
    public setRequest(req: IRquest) {
        this.request = req
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

    private uploadPart(d: IInitRet) {
       
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
                        const chunk = Blob.prototype.slice.call(this.file, start, end)
                        const chunkReader = new FileReader()
                        chunkReader.onload = (e: ProgressEvent<FileReader>) => {
                            if (e && e.target && e.target.readyState === FileReader.DONE) {
                                this.upload(d.upload_id, index, task, e.target.result as ArrayBuffer, proc)
                            }
                        }
                        chunkReader.onerror = (e: ProgressEvent<FileReader>) => {
                            console.log(e)
                        }
                        chunkReader.onerror = (e: ProgressEvent<FileReader>) => {
                            console.log(e)
                        }
                        chunkReader.readAsArrayBuffer(chunk)
                    }
                    proc()
                })
            }),
        ).then((values: any) => {
            console.log(values)
            this.merge(d.upload_id)
        })
    }
    public run() {
        const fn = (d: IInitRet): void => {
            switch (d.status) {
                case UploadStage.InitializeStatus:
                    this.uploadPart(d)
                case UploadStage.PendingStatus:
                    this.chunks = d.chunks
                    this.uploadPart(d)
                    break
                case UploadStage.FulfilledStatus:
                    this.success(d)
            }
            console.log(d.upload_id)
        }
        this.touch(fn)
    }
}
