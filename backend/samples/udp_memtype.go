package sample

import (
	"fmt"
	"log"
	"net"
	"os"

	"github.com/h2non/filetype"
)

func handleDataFileType(data []byte) {
	// استفاده از filetype برای شناسایی نوع فایل
	if kind, _ := filetype.Match(data); kind != filetype.Unknown {
		if kind.MIME.Value == "audio/mpeg" {
			// داده صوتی است
			fmt.Println("Received Audio Data (MP3)")

			// ذخیره داده صوتی در فایل
			file, err := os.OpenFile("audio_data.mp3", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err != nil {
				log.Fatal(err)
			}
			defer file.Close()
			file.Write(data)
		}
	} else {
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

func RunDataFileType() {
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
		handleDataFileType(buf[:n])
	}
}
