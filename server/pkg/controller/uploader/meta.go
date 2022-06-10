package uploader

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/tiyee/uploader/pkg/component"
	"math"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	InitializeStatus int8 = iota
	PendingStatus
	FulfilledStatus
	RejectStatus
)
const (
	OSS int8 = 1
	COS int8 = 2
)

type Meta struct {
	ctx         context.Context
	UploadID    string
	Object      string
	Size        int
	ChunkSize   int
	Host        string
	Digest      string
	Status      int8
	ContentType string
	uploaderSrc int8
	chunks      []*ChunkETag
	uploader    IUploader
	lastModify  int64
}
type MetaCacheValue struct {
	UploadID   string       `json:"u"`
	Object     string       `json:"ob"`
	Size       int          `json:"s"`
	ChunkSize  int          `json:"c"`
	Chunks     []*ChunkETag `json:"ch"`
	Digest     string       `json:"d"`
	Status     int8         `json:"st"`
	LastModify int64        `json:"l"`
	Uploader   int8         `json:"ul"`
}
type OptionFunc func(m *Meta)
type ChunkETag struct {
	Index int    `json:"index"`
	ETag  string `json:"etag"`
}
type ChunksETag []ChunkETag

func (c ChunksETag) Len() int {
	return len(c)
}

func (c ChunksETag) Less(i, j int) bool {
	return c[i].Index < c[j].Index
}

func (c ChunksETag) Swap(i, j int) {
	c[i], c[j] = c[j], c[i]
}

func FromUploadID(ctx context.Context, uploadID string, opts ...OptionFunc) (*Meta, error) {
	meta := &Meta{
		ctx:      ctx,
		Status:   InitializeStatus,
		UploadID: uploadID,
	}
	for _, opt := range opts {
		opt(meta)
	}
	if bs, err := component.BigCache.Get(uploadID); err == nil {
		var mcv MetaCacheValue
		if err := json.Unmarshal(bs, &mcv); err == nil {
			meta.Object = mcv.Object
			meta.Size = mcv.Size
			meta.ChunkSize = mcv.ChunkSize
			meta.Digest = mcv.Digest
			meta.Status = mcv.Status
			meta.chunks = mcv.Chunks
			meta.lastModify = mcv.LastModify
			fmt.Println("uploader is", mcv.Uploader)
			switch mcv.Uploader {
			case OSS:
				meta.uploader = &Oss{ctx: ctx}
			case COS:
				meta.uploader = &Cos{ctx: ctx}
			default:
				return nil, errors.New("undefined uploader" + strconv.FormatInt(int64(mcv.Uploader), 10))
			}
			meta.uploaderSrc = mcv.Uploader
			meta.uploader.Reset(meta)
			return meta, nil

		} else {
			return nil, err
		}

	} else {
		fmt.Println("get from cache", uploadID)
		return nil, err
	}
}
func FromDigest(ctx context.Context, handle int8, digest string, opts ...OptionFunc) (*Meta, error) {
	if bs, err := component.BigCache.Get(digest); err == nil {
		return FromUploadID(ctx, string(bs))
	}
	meta := &Meta{
		ctx:    ctx,
		Status: InitializeStatus,
	}
	for _, opt := range opts {
		opt(meta)
	}
	switch handle {
	case OSS:
		meta.uploader = &Oss{ctx: ctx}
	case COS:
		meta.uploader = &Cos{ctx: ctx}
	default:
		return nil, errors.New("undefined uploader")

	}
	meta.uploaderSrc = handle
	meta.uploader.Reset(meta)
	return meta, nil

}

func (m *Meta) Init() error {
	if requestID, err := m.uploader.Init(); err == nil {
		m.UploadID = requestID
		chunks := int(math.Ceil(float64(m.Size) / float64(m.ChunkSize)))
		fmt.Println("init size", chunks)
		m.chunks = []*ChunkETag{}
		m.Status = PendingStatus
		return m.Save()
	} else {
		return err
	}

}
func (m *Meta) Save() error {
	cacheValue := &MetaCacheValue{
		UploadID:   m.UploadID,
		Object:     m.Object,
		Size:       m.Size,
		ChunkSize:  m.ChunkSize,
		Chunks:     m.chunks,
		Digest:     m.Digest,
		Status:     m.Status,
		Uploader:   m.uploaderSrc,
		LastModify: time.Now().Unix(),
	}
	if bs, err := json.Marshal(cacheValue); err == nil {
		if err := component.BigCache.Set(m.UploadID, bs); err != nil {
			return err
		}
		fmt.Println("set upload_id cache", m.UploadID)
		goto cache
	} else {
		return err
	}
cache:
	return component.BigCache.Set(m.Digest, []byte(m.UploadID))
}
func (m *Meta) Touch() int8 {
	return m.Status
}
func (m *Meta) Pending() []*ChunkETag {
	return m.chunks
}
func (m *Meta) Append(ctx context.Context, index *ChunkETag) {
	m.chunks = append(m.chunks, index)
}
func (m *Meta) Url() string {
	return m.uploader.Url()
}
func (m *Meta) UploadPart(index int, chunk []byte) (*ChunkETag, error) {
	if etag, err := m.uploader.Upload(index, chunk); err == nil {
		chunkPart := ChunkETag{
			Index: index,
			ETag:  etag,
		}
		m.Append(m.ctx, &chunkPart)
		return &chunkPart, nil
	} else {
		return nil, err
	}
}
func (m *Meta) Merge(chunks []ChunkETag) error {
	var _chunks ChunksETag = chunks
	sort.Sort(_chunks)
	if err := m.uploader.Merge(_chunks); err == nil {
		m.Status = FulfilledStatus
		m.chunks = []*ChunkETag{}
		return m.Save()
	} else {
		return err
	}

}

type Uploader struct {
	RequestID string
	Object    string
	Size      int
	Host      string
	c         context.Context
}
type OptionFn func(IUploader)
type IUploader interface {
	Reset(meta *Meta)
	Url() string
	Init() (string, error)
	Upload(index int, chunk []byte) (string, error)
	Merge(chunks []ChunkETag) error
}
type HeaderPair struct {
	Key, Value string
}

func (hp *HeaderPair) Less(o *HeaderPair) bool {
	return hp.Key < o.Key
}

type Headers []*HeaderPair

func (items Headers) Len() int {
	return len(items)
}
func (items Headers) Swap(i, j int)      { items[i], items[j] = items[j], items[i] }
func (items Headers) Less(i, j int) bool { return items[i].Less(items[j]) }
func (items Headers) Sort() {
	sort.Sort(items)
}
func (items Headers) Pair(key, value string) *HeaderPair {
	return &HeaderPair{Key: key, Value: value}
}
func (items Headers) Request(r *http.Request) {
	for _, p := range items {
		r.Header.Add(p.Key, p.Value)
	}
}
func (items Headers) String() string {
	items.Sort()
	arr := make([]string, 0, len(items))
	for _, p := range items {
		p.Key = strings.ToLower(p.Key)
		arr = append(arr, fmt.Sprintf("%s:%s", p.Key, p.Value))
	}
	return strings.Join(arr, "\n")
}
