package uploader

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"encoding/xml"
	"errors"
	"fmt"
	"hash"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const BUCKET = "wizarmon"
const HOST = "oss-cn-beijing.aliyuncs.com"
const AccessKeyId = "<AccessKeyId>"
const KeySecret = "<KeySecret>"
const BaseUrl = "https://img.tiyee.cn"

type ErrorXml struct {
	Error             xml.Name `xml:"Error"`
	Code              string   `xml:"Code"`
	Message           string   `xml:"Message"`
	RequestId         string   `xml:"RequestId"`
	HostId            string   `xml:"HostId"`
	OSSAccessKeyId    string   `xml:"OSSAccessKeyId"`
	StringToSign      string   `xml:"StringToSign"`
	StringToSignBytes string   `xml:"StringToSignBytes"`
}
type InitiateMultipartUploadResult struct {
	InitiateMultipartUploadResult xml.Name
	Bucket                        string
	Key                           string
	UploadId                      string
}
type CompleteMultiPart struct {
	//Part   xml.Name `xml:"Part"`
	PartNumber int    `xml:"PartNumber" json:"i"`
	ETag       string `xml:"ETag" json:"e"`
}
type CompleteMultipartUpload struct {
	//CompleteMultipartUpload xml.Name `xml:"CompleteMultipartUpload"`
	Part []CompleteMultiPart `xml:"Part"`
}
type Oss struct {
	ctx     context.Context
	time    time.Time
	bucket  string
	host    string
	baseUrl string
	request *http.Request
	meta    *Meta
}

func (o *Oss) Reset(meta *Meta) {
	o.time = time.Now()
	o.bucket = BUCKET
	o.host = HOST
	o.baseUrl = BaseUrl
	o.meta = meta
}
func (o *Oss) Url() string {
	return o.baseUrl + "/" + o.meta.Object
}
func (o *Oss) Init() (string, error) {
	client := &http.Client{}
	if request, err := http.NewRequest("POST", o.uri(o.meta.Object)+"?uploads", nil); err == nil {
		o.request = request
		request.Header.Add("Date", o.time.UTC().Format(http.TimeFormat))
		request.Header.Add("Connection", "keep-alive")
		request.Header.Set("Content-Type", o.meta.ContentType)
		headers := Headers{}
		headers.Request(request)
		o.authorization(&headers, "/"+o.bucket+"/"+o.meta.Object+"?uploads")
		response, err := client.Do(request)
		if err != nil {
			return "", err
		}
		defer response.Body.Close()
		if response.StatusCode == 200 {
			if ret, err := ioutil.ReadAll(response.Body); err == nil {
				var result InitiateMultipartUploadResult
				if err := xml.Unmarshal(ret, &result); err == nil {
					return result.UploadId, nil
				} else {
					return "", err
				}
			} else {
				return "", err
			}
		} else {
			return "", errors.New("http response fail")
		}

	} else {
		return "", err
	}
}

func (o *Oss) Upload(index int, chunk []byte) (string, error) {
	c := o.meta
	uploadId := o.meta.UploadID
	client := &http.Client{}
	size := len(chunk)
	_url := o.uri(c.Object) + "?partNumber=" + strconv.Itoa(index+1) + "&uploadId=" + uploadId
	if request, err := http.NewRequest("PUT", _url, bytes.NewReader(chunk)); err == nil {
		o.request = request
		request.Header.Add("Date", o.time.UTC().Format(http.TimeFormat))
		request.Header.Add("Connection", "keep-alive")
		request.Header.Add("Content-Length", strconv.FormatInt(int64(size), 10))
		headers := Headers{}
		headers.Request(request)
		if b64, err := MD5(chunk, int64(len(chunk))); err == nil {
			request.Header.Add("Content-MD5", b64)
		} else {
			return "", err
		}

		o.authorization(&headers, "/"+o.bucket+"/"+c.Object+"?partNumber="+strconv.Itoa(index+1)+"&uploadId="+uploadId)

		response, err := client.Do(request)
		if err != nil {
			return "", err
		}
		defer response.Body.Close()

		if response.StatusCode != 200 {
			if ret, err := ioutil.ReadAll(response.Body); err == nil {
				fmt.Println(string(ret))

			} else {
				return "", err
			}
		} else {
			etag := response.Header.Get("ETag")
			return strings.Trim(etag, "\""), nil

		}

	} else {
		return "", err
	}
	return "", nil
}

func (o *Oss) Merge(chunks []ChunkETag) error {

	body := CompleteMultipartUpload{}
	for _, chunk := range chunks {

		body.Part = append(body.Part, CompleteMultiPart{
			PartNumber: chunk.Index + 1,
			ETag:       chunk.ETag,
		})

	}
	xmlData, err := xml.Marshal(body)
	if err != nil {
		return err
	}
	c := o.meta
	client := &http.Client{}
	bodyReader := bytes.NewReader(xmlData)
	_url := o.uri(c.Object) + "?uploadId=" + c.UploadID
	if request, err := http.NewRequest("POST", _url, bodyReader); err == nil {
		o.request = request
		request.Header.Add("Date", o.time.UTC().Format(http.TimeFormat))
		request.Header.Add("Connection", "Close")
		headers := Headers{}
		headers.Request(request)
		if b64, err := MD5(xmlData, bodyReader.Size()); err == nil {
			request.Header.Add("Content-MD5", b64)
		} else {
			return err
		}

		o.authorization(&headers, "/"+o.bucket+"/"+c.Object+"?uploadId="+c.UploadID)
		response, err := client.Do(request)
		if err != nil {
			return err
		}
		defer response.Body.Close()

		if response.StatusCode != 200 {
			if ret, err := ioutil.ReadAll(response.Body); err == nil {
				fmt.Println(string(ret))
			} else {
				return err
			}
		} else {
			return nil
		}

	} else {
		return err
	}
	return nil
}
func (o *Oss) Header() *http.Header {
	return &o.request.Header
}
func (o *Oss) authorization(headers *Headers, canonicalizedResource string) {
	signature := o.signature(headers, canonicalizedResource)
	o.Header().Set("Authorization", "OSS "+AccessKeyId+":"+signature)
}
func (o *Oss) signature(headers *Headers, canonicalizedResource string) string {
	date := o.time.UTC().Format(http.TimeFormat)
	contentMD5 := o.Header().Get("Content-MD5")
	canonicalizedOSSHeaders := headers.String()
	if len(canonicalizedOSSHeaders) > 0 {
		canonicalizedResource = canonicalizedOSSHeaders + "\n" + canonicalizedResource
	}
	arr := []string{o.request.Method, contentMD5, o.Header().Get("Content-Type"), date, canonicalizedResource}
	h := hmac.New(func() hash.Hash { return sha1.New() }, []byte(KeySecret))
	if _, err := io.WriteString(h, strings.Join(arr, "\n")); err != nil {
		return ""
	}
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

func (o *Oss) uri(object string) string {
	return "http://" + o.bucket + "." + o.host + "/" + object
}

type httpRequestOpts func(o *Oss, request *http.Request, headers *Headers)

func (o *Oss) httpRequest(method, uri string, data []byte, parser func(response *http.Response) error, opts ...httpRequestOpts) error {
	client := &http.Client{}
	if request, err := http.NewRequest(method, uri, bytes.NewReader(data)); err == nil {
		o.request = request
		request.Header.Add("Date", o.time.UTC().Format(http.TimeFormat))
		request.Header.Add("Content-Length", strconv.Itoa(len(data)))
		request.Header.Add("Connection", "Close")
		request.Header.Add("Content-Type", o.meta.ContentType)
		headers := &Headers{}
		for _, opt := range opts {
			opt(o, request, headers)
		}
		headers.Request(request)
		if len(data) > 0 {
			if b64, err := MD5(data, 0); err == nil {
				request.Header.Add("Content-MD5", b64)
			} else {
				return err
			}
		}
		o.authorization(headers, "/"+o.bucket+"/"+o.meta.Object)
		if response, err := client.Do(request); err == nil {
			return parser(response)
		} else {
			return err
		}

	} else {
		return err
	}

}
