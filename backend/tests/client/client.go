package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"time"
)

func sendAudioFile(filePath string, serverAddr string) {
	// باز کردن فایل صوتی
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
	}
	defer file.Close()

	const maxPacketSize = 5 * 1024     // 1KB
	buf := make([]byte, maxPacketSize) // بافر برای ذخیره داده‌های صوتی

	conn, err := net.Dial("udp", serverAddr)
	if err != nil {
		log.Fatalf("Error dialing UDP server: %v", err)
	}
	defer conn.Close()

	for {
		n, err := file.Read(buf)
		if err != nil && err.Error() != "EOF" {
			log.Fatalf("Error reading file: %v", err)
		}

		if n == 0 {
			break
		}

		// ارسال داده به سرور
		_, err = conn.Write(buf[:n])
		if err != nil {
			log.Fatalf("Error sending data: %v", err)
		}
		fmt.Printf("Sent %d bytes of audio data\n", n)

		// تاخیر کوتاه برای جلوگیری از ارسال خیلی سریع
		time.Sleep(1 * time.Millisecond)
	}

	fmt.Println("File sent successfully")
}

func main() {
	// مسیر فایل صوتی و آدرس سرور UDP
	filePath := "/Users/mero/Music/test.mp3" // مسیر فایل MP3 خود را وارد کنید
	// مسیر فایل MP3 خود را وارد کنید
	serverAddr := "localhost:5000" // آدرس سرور UDP

	// ارسال فایل صوتی به سرور
	sendAudioFile(filePath, serverAddr)
}
