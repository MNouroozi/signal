package main

import (
	"fmt"
	"log"
	"net"
	"os"
	"time"
)

func sendAudioFile(filePath string, serverAddr string, serverPort int, localPort int) {
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatalf("Error opening file: %v", err)
	}
	defer file.Close()

	const maxPacketSize = 5 * 1024
	buf := make([]byte, maxPacketSize)

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

		_, err = conn.Write(buf[:n])
		if err != nil {
			log.Fatalf("Error sending data: %v", err)
		}
		fmt.Printf("Sent %d bytes of audio data from port %d\n", n, localPort)

		time.Sleep(1 * time.Millisecond)
	}

	fmt.Println("File sent successfully")
}

func main() {
	filePath := "/Users/mero/Music/test.mp3"
	serverAddr := "localhost"
	serverPort := 5000
	localPort := 65534

	for i := 1; i <= 1; i++ {
		time.Sleep(5 * time.Second)
		sendAudioFile(filePath, serverAddr, serverPort, localPort)
	}
}
