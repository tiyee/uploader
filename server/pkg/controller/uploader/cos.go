package uploader

import "context"

type Cos struct {
	ctx context.Context
}

func (c *Cos) Reset(meta *Meta) {
	//TODO implement me
	panic("implement me")
}
func (c *Cos) Init() (string, error) {
	//TODO implement me
	panic("implement me")
}
func (c *Cos) Url() string {
	return ""
}
func (c *Cos) Upload(index int, chunk []byte) (string, error) {
	//TODO implement me
	panic("implement me")
}

func (c *Cos) Merge(chunks []ChunkETag) error {
	//TODO implement me
	panic("implement me")
}
