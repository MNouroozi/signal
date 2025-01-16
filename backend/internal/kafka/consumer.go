package kafka

import (
	"fmt"
	"log"
	client "signal/internal/minio/Client"
	"signal/internal/minio/handler"

	"github.com/IBM/sarama"
)

type FileMetadata struct {
	IP   string
	Port int
}

func InitKafkaConsumer(brokerList []string) error {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	consumer, err := sarama.NewConsumer(brokerList, config)
	if err != nil {
		return fmt.Errorf("failed to initialize Kafka consumer: %w", err)
	}

	partitions, err := consumer.Partitions("audio_topic")
	if err != nil {
		return fmt.Errorf("failed to fetch partitions: %w", err)
	}

	for _, partition := range partitions {
		pc, err := consumer.ConsumePartition("audio_topic", partition, sarama.OffsetNewest)
		if err != nil {
			return fmt.Errorf("failed to consume partition: %w", err)
		}
		go handleMessages(pc)
	}

	return nil
}

// func handleMessages(pc sarama.PartitionConsumer) {
// 	fileChunks := make(map[string][][]byte)       // ذخیره چانک‌ها بر اساس file_id
// 	fileMetadata := make(map[string]FileMetadata) // ذخیره متادیتای فایل‌ها

// 	mc, err := minio.InitMinioClient()
// 	if err != nil {
// 		log.Fatal("error connecting to minio", err)
// 	}

// 	for msg := range pc.Messages() {
// 		go func(message *sarama.ConsumerMessage) {
// 			var chunkMessage map[string]interface{}
// 			if err := json.Unmarshal(message.Value, &chunkMessage); err != nil {
// 				log.Printf("Failed to deserialize message: %v", err)
// 				return
// 			}

// 			fileID, ok := chunkMessage["file_id"].(string)
// 			if !ok {
// 				log.Println("Invalid file_id in message")
// 				return
// 			}

// 			// استخراج IP و Port
// 			ip, ipOk := chunkMessage["sender_ip"].(string)
// 			port, portOk := chunkMessage["sender_port"].(float64)
// 			if !ipOk || !portOk {
// 				log.Printf("Invalid IP or port in message: %+v", chunkMessage)
// 				return
// 			}
// 			portInt := int(port)

// 			// ذخیره متادیتا برای فایل
// 			meta, exists := fileMetadata[fileID]
// 			if !exists {
// 				log.Printf("Metadata for file %s not found, creating new entry", fileID)
// 				fileMetadata[fileID] = FileMetadata{IP: ip, Port: portInt}
// 				meta = fileMetadata[fileID] // اطمینان از مقداردهی اولیه متغیر meta
// 			}

// 			// بررسی کامل داده‌ها قبل از ارسال به MinIO
// 			if fileID == "" || meta.IP == "" || meta.Port == 0 {
// 				log.Println("Invalid file metadata")
// 				return
// 			}

// 			// استخراج اطلاعات چانک
// 			chunkIndex, chunkIndexOk := chunkMessage["chunk_index"].(float64)
// 			totalChunks, totalChunksOk := chunkMessage["total_chunks"].(float64)
// 			if !chunkIndexOk || !totalChunksOk {
// 				log.Println("Invalid chunk index or total chunks in message")
// 				return
// 			}

// 			dataInterface, ok := chunkMessage["data"]
// 			if !ok || dataInterface == nil {
// 				log.Println("Invalid or missing data in message")
// 				return
// 			}

// 			data, ok := dataInterface.(string)
// 			if !ok {
// 				log.Println("Data is not of type string")
// 				return
// 			}

// 			// ذخیره داده‌های چانک‌ها
// 			if len(fileChunks[fileID]) < int(totalChunks) {
// 				fileChunks[fileID] = make([][]byte, int(totalChunks))
// 			}

// 			if int(chunkIndex)-1 < len(fileChunks[fileID]) {
// 				fileChunks[fileID][int(chunkIndex)-1] = []byte(data)
// 			}

// 			// بررسی کامل بودن چانک‌ها
// 			complete := true
// 			for _, chunk := range fileChunks[fileID] {
// 				if chunk == nil {
// 					complete = false
// 					break
// 				}
// 			}

// 			// اگر همه چانک‌ها دریافت شده باشد، فایل را بازسازی کرده و به MinIO آپلود می‌کنیم
// 			if complete {
// 				var completeFile []byte
// 				for _, chunk := range fileChunks[fileID] {
// 					completeFile = append(completeFile, chunk...)
// 				}

// 				// آپلود فایل به MinIO
// 				if err := handelMinio.UploadToMinIO(mc, fileID, completeFile); err != nil {
// 					log.Printf("Failed to upload file %s to MinIO: %v", fileID, err)
// 				} else {
// 					log.Printf("File %s successfully uploaded to MinIO", fileID)
// 				}

// 				// پاک‌سازی داده‌ها پس از آپلود موفق
// 				delete(fileChunks, fileID)
// 				delete(fileMetadata, fileID)
// 			}
// 		}(msg)
// 	}
// }

func handleMessages(pc sarama.PartitionConsumer) {
	mc, err := client.InitMinioClient()
	if err != nil {
		log.Fatal("Error connecting to Minio:", err)
	}

	for msg := range pc.Messages() {
		go func(message *sarama.ConsumerMessage) {

			data := message.Value

			fileID := string(message.Key)

			l, err := handler.UploadToMinIO(mc, "audio-files", fileID, data)
			if err != nil {
				log.Printf("Failed to upload file %s to MinIO: %v", fileID, err)
			} else {
				log.Printf("File %s.mp3 successfully uploaded to MinIO\n", fileID)
				log.Printf("link: %s", l)
			}

		}(msg)
	}
}
