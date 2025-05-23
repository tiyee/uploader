/** @format */
import { IFileHandle, IRequest, IURLSearchParams, Uploader } from 'uploader';
import { IInitRet, IContext, IUploadPartRet } from 'uploader';
declare class URLSearchParams implements IURLSearchParams {
    private data;
    constructor();
    set(k: string, v: string): void;
    append(k: string, v: string): void;
    delete(k: string): void;
    toString(): string;
}
declare class WxmFile implements IFileHandle {
    readonly fsm: WechatMiniprogram.FileSystemManager;
    readonly filePath: string;
    private _size;
    constructor(fsm: WechatMiniprogram.FileSystemManager, filePath: string, size: number);
    size(): number;
    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void;
    _digest(success: (params: string) => void, fail: (e: Error) => void): void;
    digest(success: (params: string) => void, fail: (e: Error) => void): void;
}
declare class WxmRequest implements IRequest {
    initRequest(ctx: IContext, params: URLSearchParams, hexHash: ArrayBuffer, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
    chunkRequest(ctx: IContext, params: URLSearchParams, chunk: ArrayBuffer, resolve: (res: IUploadPartRet) => void, fail: (e: Error) => void): void;
    mergeRequest(ctx: IContext, params: URLSearchParams, chunks: string, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
}
declare const uploader: (ctx: IContext, filePath: string) => Promise<Uploader<WxmFile, WxmRequest, URLSearchParams>>;
export default uploader;
