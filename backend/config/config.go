package config

import (
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/joho/godotenv"
)

type Config struct {
	DSN                 string
	TCP_IP              string
	TCP_Port            string
	UDP_Ip              string
	UDP_Port            string
	Log_Level           string
	Minio_Endpoint      string
	Minio_Access_Key    string
	Minio_Secret_Key    string
	Minio_Root_User     string
	Minio_Root_Password string
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
			DSN:                 getEnv("DSN", "host=localhost user=signal password=signal123 dbname=signaldb port=5432 sslmode=disable"),
			TCP_IP:              getEnv("TCP_IP", "127.0.0.1"),
			TCP_Port:            getEnv("TCP_PORT", "4000"),
			UDP_Ip:              getEnv("UDP_IP", "127.0.0.1"),
			UDP_Port:            getEnv("UDP_PORT", "5000"),
			Log_Level:           getEnv("LOG_LEVEL", "INFO"),
			Minio_Endpoint:      getEnv("MINIO_ENDPOINT", "localhost:9000"),
			Minio_Root_User:     getEnv("MINIO_ROOT_USER", "admin@signal.com"),
			Minio_Root_Password: getEnv("MINIO_ROOT_PASSWORD", "admin123"),
			Minio_Access_Key:    getEnv("MINIO_ACCESS_KEY", "GVUF9AahTWQFqlYGi7bl"),
			Minio_Secret_Key:    getEnv("MINIO_SECRET_KEY", "i90gm8bYL8guITSARrvPe4BQzWsTBs5VlDqZetDA"),
		}

		log.Printf("Environment variables\n: ME:%s\nMR:%s\nMRP:%s\nMAK:%s\nMSK:%s\n",
			os.Getenv("MINIO_ENDPOINT"),
			os.Getenv("MINIO_ROOT_USER"),
			os.Getenv("MINIO_ROOT_PASSWORD"),
			os.Getenv("MINIO_ACCESS_KEY"),
			os.Getenv("MINIO_SECRET_KEY"),
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
