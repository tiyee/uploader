package uploader

import (
	"bytes"
	"crypto/md5"
	"encoding/base64"
	"io"
	"log"
	"math"
	"os"
)

const FileChunk = 8192

func MD5(bs []byte, fileSize int64) (string, error) {
	if fileSize < 1 {
		fileSize = int64(len(bs))
	}
	reader := bytes.NewReader(bs)
	blocks := uint64(math.Ceil(float64(fileSize) / float64(FileChunk)))
	hs := md5.New()
	for i := uint64(0); i < blocks; i++ {
		blockSize := int(math.Min(FileChunk, float64(fileSize-int64(i*FileChunk))))
		buf := make([]byte, blockSize)
		if _, err := reader.Read(buf); err != nil {
			if err != io.EOF {
				return "", err
			}
		}
		if _, err := io.WriteString(hs, string(buf)); err != nil {
			return "", err
		}
	}
	sum := hs.Sum(nil)
	return base64.StdEncoding.EncodeToString(sum[:]), nil

}
func FileMd5(f *os.File) (string, error) {
	//if _, err := f.Seek(0, io.SeekStart); err != nil {
	//	return "", err
	//}
	h := md5.New()
	if _, err := io.Copy(h, f); err != nil {
		log.Fatal(err)
	}
	sum := h.Sum(nil)
	return base64.StdEncoding.EncodeToString(sum[:]), nil
}
func Ext(mime string) string {
	switch mime {
	case "image/bmp":
		return "bmp"
	case "image/gif":
		return "gif"
	case "image/png":
		return "png"
	case "image/jpeg":
		return "jpg"
	default:
		return ""

	}
}
