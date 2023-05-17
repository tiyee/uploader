/** @format */
import {stringify} from 'qs'
export type HttpMethod = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'
interface IResponseHook {
    (resp: Response): Response
}
export interface IRequestOptions {
    method?: HttpMethod
    headers?: HeadersInit
    params?: URLSearchParams | Record<string, string | number | boolean> | string | []
    data?: FormData | string | Record<string, any> | Array<any> | BodyInit
    timeout?: number
    credentials?: RequestCredentials
    mod?: RequestMode
    prefix?: string
    suffix?: string
    requestType?: 'json' | 'form'
    responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
    hooks?: Array<IResponseHook>
}
const checkStatusHook: IResponseHook = (response: Response): Response => {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(`request error: ${response.statusText}`)
        throw error
    }
}
const initOptions: IRequestOptions = {
    method: 'get',
    params: {},
    data: '',
    timeout: 1000,
    credentials: 'same-origin',
    headers: {},
    mod: 'same-origin',
    prefix: '',
    suffix: '',
    requestType: 'json',
    responseType: 'json',
    hooks: [checkStatusHook],
}
const buildRequestInit = (options: IRequestOptions): RequestInit => {
    const myInit: RequestInit = {}
    const opts = {...initOptions, ...options}
    const {requestType = 'json', data} = opts
    let body: BodyInit | undefined
    if (data) {
        const dataType = Object.prototype.toString.call(data)
        if (dataType === '[object Object]' || dataType === '[object Array]') {
            if (requestType === 'json') {
                opts.headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    ...opts.headers,
                }
                body = JSON.stringify(data)
            } else if (requestType === 'form') {
                opts.headers = {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    ...opts.headers,
                }
                body = stringify(data, {arrayFormat: 'repeat', strictNullHandling: true})
            }
        } else {
            // 其他 requestType 自定义header
            opts.headers = {
                Accept: 'application/json',
                ...opts.headers,
            }
            body = data as BodyInit
        }
    }

    myInit.method = opts.method?.toUpperCase()
    myInit.headers = opts.headers
    myInit.body = body
    myInit.credentials = opts.credentials
    myInit.mode = opts.mod

    return myInit
}
class RequestInstance {
    private opts: IRequestOptions

    constructor(opts: IRequestOptions) {
        this.opts = opts || {}
    }

    public async _request(method: HttpMethod, url: string, options?: IRequestOptions): Promise<Response> {
        const opts = {...this.opts, ...options, method}
        const prefix = opts.prefix ?? ''
        const suffix = opts.suffix ?? ''
        url = `${prefix}${url}${suffix}`

        if (opts.params) {
            const paramsType = Object.prototype.toString.call(opts.params)
            if (paramsType === '[object URLSearchParams]') {
                opts.params = opts.params.toString()
            } else if (paramsType === '[object Object]' || paramsType === '[object Array]') {
                opts.params = stringify(opts.params, {arrayFormat: 'brackets'})
            }

            const urlSign = url.indexOf('?') !== -1 ? '&' : '?'
            url = `${url}${urlSign}${opts.params}`
        }

        const myRequest = new Request(url)
        let resp = fetch(myRequest, buildRequestInit(opts))
        opts.hooks = opts.hooks ?? []
        for (const hook of opts.hooks) {
            resp = resp.then(hook)
        }
        return resp
    }
    async get(url: string, options?: IRequestOptions) {
        return this._request('get', url, options)
    }
    async post(url: string, options?: IRequestOptions) {
        return this._request('post', url, options)
    }
    async delete(url: string, options?: IRequestOptions) {
        return this._request('delete', url, options)
    }
    async put(url: string, options?: IRequestOptions) {
        return this._request('put', url, options)
    }
}

const request = (opts: IRequestOptions = initOptions) => {
    return new RequestInstance(opts)
}
export const extend = (initOpts: IRequestOptions) => request(initOpts)
export default request({})
