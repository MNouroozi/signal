package udp

import (
	"log"
	"net"
	"os"
	"time"

	config "signal/config"
	"signal/internal/kafka"
	postgers "signal/internal/postgres"

	"github.com/hajimehoshi/go-mp3"
	"gorm.io/gorm"
)

var audioQueue = make(chan AudioData, 100)

func ProcessAudioQueue(db *gorm.DB) {
	for data := range audioQueue {
		saveAudioData(db, data.Data, data.IP, data.Port, data.Duration)

		// ذخیره داده صوتی در PostgreSQL
		audioLog := postgers.AudioLog{
			IP:       data.IP,
			Port:     data.Port,
			Duration: data.Duration,
			FileName: "audio-file.mp3", // نام فایل برای ذخیره در پایگاه داده
		}

		err := postgers.SaveAudioLog(db, audioLog)
		if err != nil {
			log.Printf("Error saving audio log to PostgreSQL: %v", err)
		}

		// ارسال داده صوتی به Kafka
		err = kafka.SendAudioToKafka(data.Data)
		if err != nil {
			log.Println(err)
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

	for {
		n, addr, err := ln.ReadFrom(buf)
		if err != nil {
			log.Println("Error reading data:", err)
			continue
		}
		log.Printf("Received data from %s, size: %d bytes\n", addr.String(), n)

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

			audioQueue <- AudioData{
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
	// Save the audio data to a temporary file to read with go-mp3
	tmpFile, err := os.CreateTemp("", "audio*.mp3")
	if err != nil {
		log.Printf("Error creating temporary file: %v", err)
		return 0
	}
	defer tmpFile.Close()

	_, err = tmpFile.Write(audioData)
	if err != nil {
		log.Printf("Error writing to temporary file: %v", err)
		return 0
	}

	// Open the temporary MP3 file
	file, err := os.Open(tmpFile.Name())
	if err != nil {
		log.Printf("Error opening temporary file: %v", err)
		return 0
	}
	defer file.Close()

	// Decode the MP3 file
	decoder, err := mp3.NewDecoder(file)
	if err != nil {
		log.Printf("Error decoding MP3: %v", err)
		return 0
	}

	// Get the sample rate by calling the function sampleRate()
	sampleRate := float64(decoder.SampleRate())

	// Get the number of frames (length of the audio in frames)
	numFrames := decoder.Length()

	// Calculate the duration in seconds
	durationInSeconds := float64(numFrames) / sampleRate

	// Convert to minutes
	// durationInMinutes := durationInSeconds / 60.0

	log.Printf("🎉 Audio duration calculated: %f minutes", durationInSeconds)

	return durationInSeconds
}
