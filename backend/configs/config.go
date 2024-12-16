package config

import (
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/joho/godotenv"
)

type Config struct {
	DSN      string
	HTTPIP   string
	HTTPPort string
	UDPIP    string
	UDPPort  string
	LogLevel string
}

var (
	once     sync.Once
	instance *Config
)

func GetConfig() *Config {
	once.Do(func() {
		// Get the current working directory
		dir, err := os.Getwd()
		if err != nil {
			log.Fatalf("Error getting current working directory: %v", err)
		}

		// Create the path to the .env file located in the backend/ directory
		envPath := filepath.Join(dir, "..", "..", ".env")

		// Load the .env file
		if err := godotenv.Load(envPath); err != nil {
			log.Printf("(.env) not found! Description: %v", err)
		} else {
			log.Println(".env file loaded successfully!")
		}

		// Initialize the configuration using environment variables or default values
		instance = &Config{
			DSN:      getEnv("DSN", "host=localhost user=signal password=signal123 dbname=signaldb port=5432 sslmode=disable"),
			HTTPIP:   getEnv("HTTP_IP", "127.0.0.1"),
			HTTPPort: getEnv("HTTP_PORT", "4000"),
			UDPIP:    getEnv("UDP_IP", "127.0.0.1"),
			UDPPort:  getEnv("UDP_PORT", "5000"),
			LogLevel: getEnv("LOG_LEVEL", "INFO"),
		}
	})
	return instance
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
