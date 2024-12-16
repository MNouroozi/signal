package proxy

import (
	"fmt"
	"log"
	"net"
)

func SendDataToUDP(msgType string, data []byte) {
	udpAddr, err := net.ResolveUDPAddr("udp", "localhost:5000")
	if err != nil {
		log.Fatal(err)
	}

	conn, err := net.DialUDP("udp", nil, udpAddr)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	message := fmt.Sprintf("%s|%s", msgType, string(data))
	_, err = conn.Write([]byte(message))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Send Data with UDP:", message)
}
