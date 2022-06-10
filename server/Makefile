.PHONY: web lint test
export GO111MODULE=on
export GOPROXY=https://goproxy.cn
all:web
web:
	go build -o bin/web cmd/main.go
lint:
	go mod tidy
test:
	go test -coverprofile=coverage.out ./pkg/...

fmt:
	go fmt ./pkg/... ./cmd/... && goimports -w ./pkg ./cmd