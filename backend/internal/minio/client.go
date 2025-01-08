package minio

import (
	"fmt"
	"signal/config"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func InitMinioClient() (*minio.Client, error) {
	cfg := config.GetConfig()
	useSSL := false

	minioClient, err := minio.New(cfg.Minio_Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.Minio_Access_Key, cfg.Minio_Secret_Key, ""),
		Secure: useSSL,
	})

	if err != nil {
		return nil, fmt.Errorf("failed to initialize MinIO client: %w", err)
	}

	return minioClient, nil
}
