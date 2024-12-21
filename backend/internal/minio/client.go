package minio

import (
	"fmt"
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func InitializeMinio() (*minio.Client, error) {
	client, err := minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4("your-access-key", "your-secret-key", ""),
		Secure: false, // یا true اگر از HTTPS استفاده می‌کنید
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize MinIO client: %v", err)
	}
	log.Println("MinIO client initialized successfully")
	return client, nil
}
