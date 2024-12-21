package minio

import (
	"bytes"
	"log"

	"github.com/minio/minio-go/v7"
	"golang.org/x/net/context"
)

// UploadFile uploads a file to MinIO

func UploadFile(audioData []byte, minioClient *minio.Client) error {
	ctx := context.Background()

	// تعیین نام فایل و ذخیره‌سازی آن در MinIO
	fileName := "audio-file.mp3"
	bucketName := "signal"

	byteReader := bytes.NewReader(audioData)

	_, err := minioClient.PutObject(ctx, bucketName, fileName, byteReader, int64(len(audioData)), minio.PutObjectOptions{})
	if err != nil {
		log.Printf("Error uploading file to MinIO: %v", err)
		return err
	}

	log.Println("Audio saved to MinIO successfully.")
	return nil
}
