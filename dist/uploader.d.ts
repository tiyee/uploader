/** @format */
import { IRequestOptions } from './request';
export interface IFileHandle {
    read(start: number, length: number, success: (params: ArrayBuffer) => void, fail: (e: Error) => void): void;
    digest(success: (params: string) => void, fail: (e: Error) => void): void;
    size(): number;
}
export interface IRequest {
    initRequest(ctx: IContext, params: IURLSearchParams, hexHash: ArrayBuffer, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
    chunkRequest(ctx: IContext, params: IURLSearchParams, chunk: ArrayBuffer, resolve: (res: IUploadPartRet) => void, fail: (e: Error) => void): void;
    mergeRequest(ctx: IContext, params: IURLSearchParams, chunks: string, resolve: (res: IInitRet) => void, fail: (e: Error) => void): void;
}
export interface IURLSearchParams {
    set(k: string, v: string): void;
    toString(): string;
    append(k: string, v: string): void;
    delete(k: string): void;
}
export type HanleEvent = 'progress' | 'retry' | 'success' | 'fail' | 'complete';
export interface IContext extends IRequestOptions {
    maxConcurrency: number;
    totalSize: number;
    chunkSize: number;
    testChunks: boolean;
    touchUrl: string;
    uploadUrl: string;
    mergeUrl: string;
    ext: string;
}
declare const enum UploadStage {
    InitializeStatus = 0,
    PendingStatus = 1,
    FulfilledStatus = 2,
    RejectStatus = 3
}
interface IChunk {
    index: number;
    etag: string;
}
export interface IInitRet {
    status: UploadStage;
    upload_id: string;
    chunks: Array<IChunk>;
    url: string;
}
export interface IJsonRet<T> {
    error: number;
    msg: string;
    data: T;
}
export interface IUploadPartRet {
    etag: string;
    index: number;
    upload_id: string;
}
export declare class Uploader<F extends IFileHandle, R extends IRequest, USP extends IURLSearchParams> {
    private uspType;
    readonly f: F;
    readonly r: R;
    private ctx;
    private chunks;
    private readonly totalSize;
    private readonly totalChunks;
    private readonly chunksize;
    private uploadedSize;
    private digest;
    private tasks;
    private readonly maxConcurrency;
    constructor(ctx: IContext, f: F, r: R, uspType: new () => USP);
    getNew(): USP;
    private init;
    private uploadChunk;
    private upload;
    private success;
    private fail;
    private progress;
    private complete;
    private merge;
    on(event: HanleEvent, callback: (e: any) => void): void;
    run(): void;
}
export {};
