package handler

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
)

func UploadToMinIO(minioClient *minio.Client, bucketName string, fileID string, data []byte) (string, error) {
	objectName := fmt.Sprintf("%s.mp3", fileID)
	// objectName := fmt.Sprintf("%s/%d/%s.mp3", ip, port, fileID)

	mui, err := minioClient.PutObject(context.Background(), bucketName, objectName, bytes.NewReader(data), int64(len(data)), minio.PutObjectOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to MinIO: %w", err)
	}

	log.Printf("File uploaded to MinIO: FileInfo = %v\n", mui)

	l, err := CreateFileLink(minioClient, bucketName, fileID)
	if err != nil {
		log.Printf("failed to create link file: = %v\n", mui)
	}

	return l, nil
}

func CreateFileLink(minioClient *minio.Client, bucketName string, fileID string) (string, error) {
	objectName := fmt.Sprintf("%s.mp3", fileID)

	ctx := context.Background()

	expiry := time.Hour * 24 * 7
	log.Printf("minioClientminioClientminioClient: = %v\n", minioClient)

	presignedURL, err := minioClient.PresignedGetObject(ctx, bucketName, objectName, expiry, url.Values{})
	if err != nil {
		log.Printf("Failed to generate presigned URL: %v", err)
		return "", err
	}

	return presignedURL.String(), nil
}

func CreateBucket(minioClient *minio.Client, bucketName string) (string, error) {
	ctx := context.Background()

	found, err := minioClient.BucketExists(ctx, bucketName)
	if err != nil {
		return "", fmt.Errorf("failed to check if bucket exists: %w", err)
	}

	if found {
		log.Printf("Bucket '%s' already exists", bucketName)
		return bucketName, nil
	}

	if err := minioClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{}); err != nil {
		return "", fmt.Errorf("failed to create bucket '%s': %w", bucketName, err)
	}

	log.Printf("Bucket '%s' created successfully", bucketName)
	return bucketName, nil
}
