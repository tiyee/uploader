export declare type HttpMethod = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options';
interface IResponseHook {
    (resp: Response): Response;
}
export interface IRequestOptions {
    method?: HttpMethod;
    headers?: HeadersInit;
    params?: URLSearchParams | Record<string, string | number | boolean> | string | [];
    data?: FormData | string | Record<string, any> | Array<any> | BodyInit;
    timeout?: number;
    credentials?: RequestCredentials;
    mod?: RequestMode;
    prefix?: string;
    suffix?: string;
    requestType?: 'json' | 'form';
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
    hooks?: Array<IResponseHook>;
}
declare class RequestInstance {
    private opts;
    constructor(opts: IRequestOptions);
    _request(method: HttpMethod, url: string, options?: IRequestOptions): Promise<Response>;
    get(url: string, options?: IRequestOptions): Promise<Response>;
    post(url: string, options?: IRequestOptions): Promise<Response>;
    delete(url: string, options?: IRequestOptions): Promise<Response>;
    put(url: string, options?: IRequestOptions): Promise<Response>;
}
export declare const extend: (initOpts: IRequestOptions) => RequestInstance;
declare const _default: RequestInstance;
export default _default;
