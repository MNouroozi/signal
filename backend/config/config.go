package config

import (
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/joho/godotenv"
)

type Config struct {
	DSN              string
	TCP_IP           string
	TCP_Port         string
	UDP_Ip           string
	UDP_Port         string
	Log_Level        string
	Minio_Access_Key string
	Minio_Secret_Key string
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
		envPath := filepath.Join(dir, "..", ".env")

		// Load the .env file
		if err := godotenv.Load(envPath); err != nil {
			log.Printf("(.env) not found! Description: %v", err)
		} else {
			log.Println(".env file loaded successfully!")
		}

		// Initialize the configuration using environment variables or default values
		instance = &Config{
			DSN:              getEnv("DSN", "host=localhost user=signal password=signal123 dbname=signaldb port=5432 sslmode=disable"),
			TCP_IP:           getEnv("TCP_IP", "127.0.0.1"),
			TCP_Port:         getEnv("TCP_PORT", "4000"),
			UDP_Ip:           getEnv("UDP_IP", "127.0.0.1"),
			UDP_Port:         getEnv("UDP_PORT", "5000"),
			Log_Level:        getEnv("LOG_LEVEL", "INFO"),
			Minio_Access_Key: getEnv("MINIO_ACCESS_KEY", "admin@admin.com"),
			Minio_Secret_Key: getEnv("MINIO_SECRET_KEY", "admin@admin.com"),
		}

		// Log the loaded configuration for debugging purposes
		log.Printf("Loaded configuration: %+v", instance)

		// Log the individual environment variables for debugging
		log.Printf("Environment variables: DSN=%s\n, TCP_IP=%s\n, TCP_PORT=%s\n, UDP_IP=%s\n, UDP_PORT=%s\n, LOG_LEVEL=%s\n, Minio_Access_Key=%s\n, Minio_Secret_Key=%s\n",
			os.Getenv("DSN"),
			os.Getenv("TCP_IP"),
			os.Getenv("TCP_PORT"),
			os.Getenv("UDP_IP"),
			os.Getenv("UDP_PORT"),
			os.Getenv("LOG_LEVEL"),
			os.Getenv("Minio_Access_Key"),
			os.Getenv("Minio_Secret_Key"),
		)

	})
	return instance
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
