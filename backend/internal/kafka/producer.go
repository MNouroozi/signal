package kafka

import (
	"log"

	"github.com/IBM/sarama"
)

var producer sarama.SyncProducer

// func initKafkaProducer(brokerList []string) error {

// 	return nil
// }

func SendAudioToKafka(audioData []byte) error {
	// if producer == nil {
	// 	err := initKafkaProducer([]string{"localhost:9092"}) // تغییر آدرس به آدرس صحیح
	// 	if err != nil {
	// 		return fmt.Errorf("the kafka producer has not been initialized: %v", err)
	// 	}
	// }
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll // می‌توانید این را به sarama.WaitForLocal تغییر دهید
	config.Producer.Partitioner = sarama.NewHashPartitioner
	config.Producer.Return.Successes = true
	// config.Producer.MaxMessageBytes = 52428800
	// config.Producer.Flush.MaxMessages = 52428800

	var err error
	producer, err = sarama.NewSyncProducer([]string{"localhost:9092"}, config)
	if err != nil {
		log.Printf("Error initializing Kafka producer: %v", err)
		return err
	}
	message := &sarama.ProducerMessage{
		Topic: "audio_topic", // نام تاپیک Kafka
		Value: sarama.StringEncoder("audioDataaaaa"),
	}

	p, o, err := producer.SendMessage(message)
	if err != nil {
		log.Printf("Error sending data to kafka: %v", err)
		return err
	}

	log.Printf("Data sent to kafka\n partition: %v\n offset: %v\n", p, o)
	return nil
}
