package sample

import (
	"bytes"
	"fmt"
	"log"
	"net"
	"os"
)

func handleDataHeader(data []byte) {
	// بررسی فرمت MP3 (Header: ID3)
	if len(data) > 3 && bytes.Equal(data[:3], []byte("ID3")) {
		// داده صوتی است
		fmt.Println("Received Audio Data (MP3)")

		// ذخیره داده صوتی در فایل
		file, err := os.OpenFile("audio_data.mp3", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()
		file.Write(data)
	} else if len(data) > 0 {
		// داده متنی است
		message := string(data)
		fmt.Println("Received Message:", message)

		// ذخیره پیام در فایل
		file, err := os.OpenFile("messages.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatal(err)
		}
		defer file.Close()
		file.WriteString(message + "\n")
	}
}

func RunDataHader() {
	// تنظیم آدرس UDP
	udpAddr, err := net.ResolveUDPAddr("udp", ":5000")
	if err != nil {
		log.Fatal(err)
	}

	// باز کردن سرور UDP
	conn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	fmt.Println("Server is listening on UDP port 5000...")

	// بافر برای دریافت داده‌ها
	buf := make([]byte, 1024)

	for {
		// دریافت داده از کلاینت
		n, addr, err := conn.ReadFromUDP(buf)
		if err != nil {
			log.Fatal(err)
		}

		// چاپ اطلاعات مربوط به آدرس و داده‌های دریافتی
		fmt.Printf("Received %s from %s\n", string(buf[:n]), addr)

		// فراخوانی تابع برای پردازش داده
		handleDataHeader(buf[:n])
	}
}
