package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"time"
)

func sendAudioFile(filePath string, serverAddr string, serverPort int, localPort int) {
	// باز کردن فایل صوتی
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
	}
	defer file.Close()

	const maxPacketSize = 5 * 1024     // 5KB
	buf := make([]byte, maxPacketSize) // بافر برای ذخیره داده‌های صوتی

	// ایجاد اتصال UDP با استفاده از پورت محلی خاص
	conn, err := net.DialUDP("udp", &net.UDPAddr{Port: localPort}, &net.UDPAddr{IP: net.ParseIP(serverAddr), Port: serverPort})
	if err != nil {
		log.Fatalf("Error dialing UDP server on port %d: %v", localPort, err)
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
		fmt.Printf("Sent %d bytes of audio data from port %d\n", n, localPort)

		// تاخیر کوتاه برای جلوگیری از ارسال خیلی سریع
		time.Sleep(1 * time.Millisecond)
	}

	fmt.Println("File sent successfully")
}

func main() {
	// مسیر فایل صوتی و آدرس سرور UDP
	filePath := "/Users/mero/Music/test.mp3" // مسیر فایل MP3 خود را وارد کنید
	serverAddr := "localhost"
	serverPort := 5000 // آدرس سرور UDP

	// ارسال فایل صوتی به سرور با استفاده از پورت 65534
	localPort := 65534
	for i := 3; i <= 3; i++ {
		time.Sleep(5 * time.Second)
		sendAudioFile(filePath, serverAddr, serverPort, localPort)
	}
}
