package kafka

import (
	"fmt"
	"log"
	"signal/internal/common"
	"sync"

	"github.com/IBM/sarama"
	"github.com/google/uuid"
)

var producer sarama.SyncProducer
var once sync.Once

// InitializeKafkaProducer initializes the Kafka producer
func InitializeKafkaProducer(brokers []string) error {
	var err error
	once.Do(func() {
		config := sarama.NewConfig()
		config.Producer.RequiredAcks = sarama.WaitForLocal
		config.Producer.Partitioner = sarama.NewHashPartitioner
		config.Producer.Return.Successes = true
		config.Producer.MaxMessageBytes = 104857600

		producer, err = sarama.NewSyncProducer(brokers, config)
		if err != nil {
			log.Printf("Error initializing Kafka producer: %v", err)
		}
	})
	return err
}

// SendAudioToKafka sends audio data to Kafka in chunks
// func SendAudioToKafka(audioData common.AudioData, chunkSize int) error {
// 	if producer == nil {
// 		return fmt.Errorf("kafka producer is not initialized")
// 	}

// 	totalChunks := int(math.Ceil(float64(len(audioData.Data)) / float64(chunkSize)))
// 	log.Printf("Total chunks to send: %d", totalChunks)
// 	u, _ := uuid.NewRandom()

// 	for i := 0; i < totalChunks; i++ {
// 		start := i * chunkSize
// 		end := start + chunkSize
// 		if end > len(audioData.Data) {
// 			end = len(audioData.Data)
// 		}

// 		chunk := audioData.Data[start:end]

// 		// ساخت پیام JSON برای هر چانک
// 		chunkMessage := map[string]interface{}{
// 			"file_id":      u.String(), // استفاده از UUID به عنوان شناسه یکتا
// 			"chunk_index":  i + 1,
// 			"total_chunks": totalChunks,
// 			"data":         chunk,
// 		}

// 		// سریالایز کردن پیام به JSON
// 		messageJSON, err := json.Marshal(chunkMessage)
// 		if err != nil {
// 			log.Printf("Error serializing chunk message: %v", err)
// 			return err
// 		}

// 		// ارسال پیام به Kafka
// 		message := &sarama.ProducerMessage{
// 			Topic: "audio_topic",
// 			Key:   sarama.StringEncoder(u.String()),
// 			Value: sarama.ByteEncoder(messageJSON),
// 		}
// 		fmt.Printf("hi %v\n", message.Key)

// 		partition, offset, err := producer.SendMessage(message)
// 		if err != nil {
// 			log.Printf("Error sending message chunk %d: %v", i+1, err)
// 			return err
// 		}
// 		log.Printf("Chunk %d sent: partition=%v, offset=%v", i+1, partition, offset)
// 	}

//		return nil
//	}
func SendAudioToKafka(audioData common.AudioData) error {
	if producer == nil {
		return fmt.Errorf("kafka producer is not initialized")
	}

	// استفاده از UUID برای ایجاد شناسه یکتا
	u, _ := uuid.NewRandom()

	// ارسال پیام به Kafka بدون متادیتا (فقط داده باینری)
	message := &sarama.ProducerMessage{
		Topic: "audio_topic",
		Key:   sarama.StringEncoder(u.String()),   // کلید می‌تواند همان UUID باشد
		Value: sarama.ByteEncoder(audioData.Data), // فقط داده باینری ارسال می‌شود
	}

	// ارسال پیام به Kafka
	partition, offset, err := producer.SendMessage(message)
	if err != nil {
		log.Printf("Error sending message: %v", err)
		return err
	}

	log.Printf("Audio data sent: partition=%v, offset=%v", partition, offset)

	return nil
}

func CloseKafkaProducer() {
	if producer != nil {
		err := producer.Close()
		if err != nil {
			log.Printf("Error closing Kafka producer: %v", err)
		}
	}
}
