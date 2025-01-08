package udp

import (
	"bytes"
	"log"
	"net"
	"time"

	config "signal/config"

	"signal/internal/common"
	"signal/internal/kafka"
	postgers "signal/internal/postgres"

	"github.com/hajimehoshi/go-mp3"
	"gorm.io/gorm"
)

var audioQueue = make(chan common.AudioData, 100)

func ProcessAudioQueue(db *gorm.DB) {
	for data := range audioQueue {
		saveAudioData(db, data.Data, data.IP, data.Port, data.Duration)

		audioLog := postgers.AudioLog{
			IP:       data.IP,
			Port:     data.Port,
			Duration: data.Duration,
			FileName: "audio-file.mp3",
		}

		err := postgers.SaveAudioLog(db, audioLog)
		if err != nil {
			log.Printf("Error saving audio log to PostgreSQL: %v", err)
		}
		// 10485760
		err = kafka.SendAudioToKafka(data)
		if err != nil {
			log.Printf("Error sending audio data to Kafka: %v", err)
		}
	}
}

var startTimes = make(map[string]time.Time)

func StartUDPServer() error {
	cfg := config.GetConfig()
	ln, err := net.ListenPacket("udp", ":"+cfg.UDP_Port)
	if err != nil {
		log.Fatal("Error starting UDP server:", err)
	}
	defer ln.Close()

	log.Printf("✅ UDP server is starting on :%v", ln.LocalAddr().String())

	buffers := make(map[string][]byte)
	timers := make(map[string]*time.Timer)

	buf := make([]byte, 10*1024*1024)

	err = kafka.InitializeKafkaProducer([]string{"localhost:9092"})
	if err != nil {
		log.Fatalf("Failed to initialize Kafka producer: %v", err)
	}
	defer kafka.CloseKafkaProducer()

	for {
		n, addr, err := ln.ReadFrom(buf)
		if err != nil {
			log.Println("Error reading data:", err)
			continue
		}

		udpAddr, ok := addr.(*net.UDPAddr)
		if !ok {
			log.Println("Received non-UDP address:", addr.String())
			continue
		}

		audioData := buf[:n]

		clientKey := addr.String()
		if _, exists := buffers[clientKey]; !exists {
			startTimes[clientKey] = time.Now()
			buffers[clientKey] = []byte{}
		}

		buffers[clientKey] = append(buffers[clientKey], audioData...)

		if t, exists := timers[clientKey]; exists {
			t.Stop()
		}

		timers[clientKey] = time.AfterFunc(3*time.Second, func() {
			duration := calculateAudioDuration(buffers[clientKey])
			audioQueue <- common.AudioData{
				Data:     buffers[clientKey],
				IP:       udpAddr.IP.String(),
				Port:     udpAddr.Port,
				ClientID: clientKey,
				Duration: duration,
			}

			delete(buffers, clientKey)
			delete(timers, clientKey)
			delete(startTimes, clientKey)
		})
	}
}

func calculateAudioDuration(audioData []byte) float64 {
	decoder, err := mp3.NewDecoder(bytes.NewReader(audioData))
	if err != nil {
		log.Printf("Error decoding MP3: %v", err)
		return 0
	}

	sampleRate := float64(decoder.SampleRate())
	numFrames := decoder.Length()
	durationInSeconds := float64(numFrames) / sampleRate

	log.Printf("🎉 Audio duration calculated: %f seconds", durationInSeconds)
	return durationInSeconds
}
