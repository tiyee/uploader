
const SparkMD5 = require('./spark-md5')
const qs = queryParameters => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val], index) => {
      const symbol = queryString.length === 0 ? '' : '&';
      queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
      return queryString;
    }, '')
    : '';
};
const fileManager = wx.getFileSystemManager()
// 计算整个文件的md5,但是后来微信自己提供了
const wxFileDigest = (obj, fn) => {
  const {
    tempFilePath,
    totalSize,
  } = obj,
    chunkSize = 2014*1024, // Read in chunks of 1MB
    chunks = Math.ceil(totalSize / chunkSize),
    spark = new SparkMD5.ArrayBuffer()

  const callback = (i) => {
    console.log(chunkSize, chunks, i)
    if (i === chunks) {
      const digest = spark.end()
      spark.destroy()
      fn(digest)
      return
    }
    const position = i * chunkSize
    const length = Math.min(totalSize - position, chunkSize)
    fileManager.readFile({
      filePath: tempFilePath,
      position,
      length,
      success(res) {
        console.log(res.data)
        spark.append(res.data)
        callback(++i)
      },
      fail(res) {
        obj.fail(res.errMsg)
      }
    })
  }
  callback(0)
}
class WxUploader {
  constructor(ctx, tempFilePath) {
    this.ctx = ctx
    this.tempFilePath = tempFilePath
    this.chunkSize = this.ctx.chunkSize || 1024*1024 //defalut 1M
    this.chunks = []
    this.uploadedSize=0
    this.totalChunks=0
  }
  // 主要是获取文件信息
  _beforeInit = (cb) => {
    const _this = this;
    const fn = () => {
      const chunks = Math.ceil(_this.totalSize / _this.chunkSize)
      _this.totalChunks=chunks
      _this.maxConcurrency = Math.min(chunks, _this.ctx.maxConcurrency || 5)
      _this.tasks = Array.from({ length: chunks }, (_, index) => {
        return index
      })
      cb()
    }
    fileManager.getFileInfo({
      filePath: _this.tempFilePath,
      success: function (e) {
        console.log(e)
        _this.totalSize = e.size
        if (e.digest) {
          // 实际是回传了，但是文档没写，所以最好自己再判断一道
          _this.digest = e.digest
          fn()
        } else {
          wxFileDigest(_this, s => { _this.digest = s; fn() })
        }
      },
      fail: function (e) {
        console.log(e)
        _this.fail(Error(e.errMsg))
      }
    })
  }
  _init = (cb) => {
    const { tempFilePath, digest } = this;
    const _this = this;
    fileManager.readFile({
      filePath: tempFilePath,
      position: 0,
      length: 200,
      success(res) {
        res.data
        const params = {
          'size': _this.totalSize.toString(),
          'digest': digest,
          'chunk_size': _this.chunkSize.toString(),
          'ts': Date.now().toString()
        }
        wx.request({
          url: _this.ctx.touchUrl + '?' + qs(params),
          data: res.data,
          method: 'POST',
          header: {
            'content-type': 'application/octet-stream'
          },
          success(resp) {
            console.log(resp.data)
            cb(resp.data.data)
          }
        })
      },
      fail(res) {
        console.error(res)
        _this.fail(Error(res.errMsg))
      }
    })
  }
  touch = (cb) => {
    const _this = this;
    this._beforeInit(() => _this._init(cb))
  }
  upload = (upload_id, processor, idx, chunk, cb) => {
    const { uploadUrl, headers, withCredentials } = this.ctx
    const _this = this;
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(chunk)
    const digest = spark.end()
    spark.destroy();
    const params = {
      'upload_id': upload_id,
      'digest': digest,
      'index': idx.toString(),
      'ts': Date.now().toString()
    }
    wx.request({
      url: uploadUrl + '?' + qs(params),
      data: chunk,
      method: 'POST',
      header: {
        'content-type': 'application/octet-stream'
      },
      success(resp) {
        const d = resp.data
        if (d.error === 0) {
          _this.chunks.push({ index: idx, etag: d.data.etag })
          if (idx < _this.totalChunks - 1) {
            _this.uploadedSize += _this.chunkSize
          } else {
            _this.uploadedSize += (_this.totalSize - _this.chunkSize * (_this.totalChunks - 1))
          }
          _this.progress({total:_this.totalChunks,idx, uploadedSize: _this.uploadedSize, totalSize: _this.totalSize })
        }
        cb()
      }
    })
  }
  success = (d) => { console.log(d); this.complete(d) }
  progress = (d) => { console.log('progress',d) }
  fail = (e) => { console.log(d) }
  complete = (e) => {
    console.log(e)
  }
  on(event, callback) {
    switch (event) {
      case 'progress':
        this.progress = callback
        break
      case 'retry':
        break
      case 'success':
        this.success = callback
        break
      case 'fail':
        this.fail = callback
        break
      case 'complete':
        this.complete = callback
        break
    }
  }
  uploadPart = (d) => {
    const _this = this;
    for (let i = 0; i < _this.chunks.length; i++) {
      const chunk = _this.chunks[i]
      if (chunk.index < this.totalChunks-1) {
        this.uploadedSize += this.chunkSize
      } else {
        this.uploadedSize += this.totalSize - this.chunkSize * (this.chunkSize - 1)
      }
      this.progress({ uploadedSize: this.uploadedSize, totalSize: this.totalSize })
    }
    Promise.all(
      Array.from({ length: _this.maxConcurrency }, (_, index) => {
        return new Promise(resolve => {
          const proc = () => {
            const task = _this.tasks.shift()
            if (task === undefined) {
              resolve(index)
              return
            }
            const start = task * _this.chunkSize
            const end = start + _this.chunkSize >= _this.totalSize ? _this.totalSize : start + _this.chunkSize
            fileManager.readFile({
              filePath: _this.tempFilePath,
              position: start,
              length: end - start,
              success(res) {
                _this.upload(d.upload_id, index, task, res.data, proc)
              },
              fail(res) {
                console.error(res)
                _this.fail(res.errMsg)
              }
            })
          }
          proc()
        })
      }),
    ).then((values) => {
      console.log(values)
      this.merge(d.upload_id)
    })
  }
  merge = (upload_id) => {
    const { mergeUrl, headers, withCredentials } = this.ctx
    const _this = this;
    const params = {
      'upload_id': upload_id,
      'digest': this.digest
    }
    const chunks = JSON.stringify(_this.chunks)
    wx.request({
      url: mergeUrl + '?' + qs(params),
      data: chunks,
      method: 'POST',
      header: {
        'content-type': 'application/octet-stream'
      },
      success(resp) {
        const d = resp.data
        _this.success(d.data)
      }
    })
  }
  run = () => {
    const fn = (d) => {
      switch (d.status) {
        case 0:
          this.uploadPart(d)
          break;
        case 1:
          this.chunks = d.chunks
          this.uploadPart(d)
          break
        case 2:
          this.uploadedSize=this.totalSize
          this.progress({ uploadedSize: this.uploadedSize, totalSize: this.totalSize })
          this.success(d)
      }
      console.log(d)
    }
    this.touch(fn)
  }
}
module.exports = WxUploader