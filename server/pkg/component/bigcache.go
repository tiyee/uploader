package component

import (
	"github.com/allegro/bigcache/v3"
	"time"
)

var BigCache *bigcache.BigCache

func InitBigCache() error {
	if cache, err := bigcache.NewBigCache(bigcache.DefaultConfig(10 * time.Minute)); err == nil {
		BigCache = cache
		return nil
	} else {
		return err
	}
}
