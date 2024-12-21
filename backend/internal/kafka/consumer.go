package kafka

import (
	"log"

	up "signal/internal/minio"

	"github.com/IBM/sarama"
	"github.com/minio/minio-go/v7"
)

var minioClient *minio.Client

func InitKafkaConsumer(brokerList []string) error {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	consumer, err := sarama.NewConsumer(brokerList, config)
	if err != nil {
		log.Printf("Error initializing Kafka consumer: %v", err)
		return err
	}

	partitions, err := consumer.Partitions("audio_topic")
	if err != nil {
		log.Printf("Error fetching partitions: %v", err)
		return err
	}

	for _, partition := range partitions {
		pc, err := consumer.ConsumePartition("audio_topic", partition, sarama.OffsetNewest)
		if err != nil {
			log.Printf("Error consuming partition: %v", err)
			return err
		}
		go handleMessages(pc, minioClient)
	}

	return nil
}

func handleMessages(pc sarama.PartitionConsumer, minioClient *minio.Client) {
	for msg := range pc.Messages() {
		err := up.UploadFile(msg.Value, minioClient)
		if err != nil {
			log.Printf("Error saving audio to MinIO: %v", err)
		}
	}
}
