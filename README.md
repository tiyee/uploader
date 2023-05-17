<!-- @format -->

# Uploader

大文件上传插件，支持秒传，分片上传，断点续传。兼容小程序

# build

先安装依赖

> yarn install

编译支持 web 的文件

> yarn build // 或者 yarn dev

编译支持小程序的文件(小程序只编译了 commonjs 格式，如果需要，自己修改`rollup.wxm.config.js`)

> yarn wxm

## Install

1.  html 页面直接引用 dist 文件，用法参考`demo.html`
2.  es 环境可以直接引用`dist`文件夹的**web/index.esm.js**文件，也可以直接引用`src/uploader.tsx`

## 使用方法(html)

```html
<body>
    <div id="root">
        <input type="file" id="upload" onchange="upload(this.files)" />
    </div>
    <script src="/dist/index.js"></script>
    <script>
        document.getElementById('upload').onchange = function (e) {
            console.log(uploader)
            const file = e.target.files[0]
            const ctx = {
                maxConcurrency: 5,
                totalSize: file.size,
                chunkSize: 1024 * 1024,
                uploadUrl: '/2/upload',
                mergeUrl: '/2/merge',
                touchUrl: '/2/init',
                testChunks: false,
                withCredentials: 'include',
            }
            const up = uploader(ctx, file)
            up.on('progress', e => {
                console.log('progess', e)
            })
            up.on('complete', e => {
                console.log('complete', e)
                alert(e.url)
            })
            up.run()
        }
    </script>
</body>
```

## 监听事件

-   `success`，上传成功时触发，e = {"upload_id":"xxxxx","status":1,"url":"","chunks":[]},其中 status 定义 0:待上传，1：上传中，2：已完成，3：已失败

-   `fail`，上传失败时触发，e :Error
-   `complete`，上传成功或失败时触发，返回值同 success 或 fail
-   `progess`，上传进度变化时触发，返回内容如下 e={ uploadedSize: 1286679, totalSize: 1286679 }

## 服务端接口

### touchUrl (post)

初始化上传动作，返回 upload_id，会携带文件 md5 和 mime 信息，

如果文件已经存在，则直接返回 status=2，url 不为空。

如果之前上传过，status=1,chunks 会返回已经上传的 chunk 的 index 和 hash

#### ur 参数

| 属性       | 类型     | 说明              |
| ---------- | -------- | ----------------- |
| size       | `String` | 整个文件的 md5 值 |
| chunk_size | `String` | 整个文件的大小    |
| digest     | `String` | 整个文件的 md5 值 |

#### body

文件的前 200 个字节(为了获取文件的`mime`)

#### 返回参数

| 属性      | 类型                                | 说明                                      |
| --------- | ----------------------------------- | ----------------------------------------- |
| url       | `String`                            | 已上传时返回线上文件路径                  |
| upload_id | `String`                            | 上传凭证，如果已完成，该字段为空字符串    |
| chunks    | `Array<{index:number,etag:string}>` | 未完全上传时，返回已上传的分块序号        |
| status    | `int`                               | 0:待上传，1：上传中，2：已完成，3：已失败 |

### uploadUrl (post)

分片传输

#### ur 参数

| 属性      | 类型     | 说明                |
| --------- | -------- | ------------------- |
| index     | `String` | 分片序号，从 0 开始 |
| upload_id | `String` | 传输凭证            |
| digest    | `String` | 分片内容的 md5 值   |

#### body

传输的分片内容

### mergeUrl

合并传输分片

#### ur 参数

| 属性      | 类型     | 说明              |
| --------- | -------- | ----------------- |
| upload_id | `String` | 传输凭证          |
| digest    | `String` | 整个文件的 md5 值 |

#### body

json 格式，所有分片的编号和摘要，Array<{index:number,etag:string}>

## 微信小程序

用法与 h5 一致，参考 wxm 文件夹下的代码
