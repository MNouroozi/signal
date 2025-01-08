package udp

import (
	"log"
	"signal/internal/common"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func saveAudioData(db *gorm.DB, audio []byte, ip string, port int, duration float64) {
	data := common.AudioData{
		ID:        uuid.New(),
		Data:      audio,
		CreatedAt: time.Now(),
		IP:        ip,
		Port:      port,
		Duration:  duration,
	}

	tx := db.Begin()
	if err := tx.Create(&data).Error; err != nil {
		tx.Rollback()
		log.Println("Error saving audio data:", err)
		return
	}
	tx.Commit()
}

// func chunkAudioData(data []byte, maxSize int) [][]byte {
// 	var chunks [][]byte
// 	for len(data) > maxSize {
// 		chunks = append(chunks, data[:maxSize])
// 		data = data[maxSize:]
// 	}
// 	if len(data) > 0 {
// 		chunks = append(chunks, data)
// 	}
// 	return chunks
// }

// func sendAudioToKafka(data AudioData, chunk []byte) error {
// 	writer := kafka.NewWriter(kafka.WriterConfig{
// 		Brokers:  []string{"localhost:9092"},
// 		Topic:    "audio-data",
// 		Balancer: &kafka.LeastBytes{},
// 	})
// 	defer writer.Close()

// 	msg := kafka.Message{
// 		Key:   []byte(data.ClientID),
// 		Value: chunk,
// 	}

// 	err := writer.WriteMessages(context.Background(), msg)
// 	if err != nil {
// 		return err
// 	}

// 	log.Printf("🎉 Audio chunk sent to Kafka topic 'audio-data' successfully.")
// 	return nil
// }
