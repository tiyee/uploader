/** @format */
import { IFileHandle, IRequest, Uploader } from 'uploader';
import { IRequestOptions, HttpMethod } from 'request';
import { IInitRet, IContext, IUploadPartRet } from 'uploader';
declare class WebFile implements IFileHandle {
    readonly file: File;
    constructor(file: File);
    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void;
    digest(success: (params: string) => void, fail: (e: Error) => void): void;
    size(): number;
}
declare class WebRequest implements IRequest {
    request(method: HttpMethod, url: string, opts: IRequestOptions): Promise<any>;
    initRequest(ctx: IContext, params: URLSearchParams, hexHash: ArrayBuffer, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
    chunkRequest(ctx: IContext, params: URLSearchParams, chunk: ArrayBuffer, resolve: (res: IUploadPartRet) => void, fail: (e: Error) => void): void;
    mergeRequest(ctx: IContext, params: URLSearchParams, chunks: string, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
}
declare const uploader: (ctx: IContext, f: File) => Uploader<WebFile, WebRequest, URLSearchParams>;
export default uploader;
