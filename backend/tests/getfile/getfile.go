package main

import (
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// مدل GORM برای داده‌های صوتی
type AudioData struct {
	ID        uuid.UUID `gorm:"primaryKey"`
	Data      []byte    `gorm:"type:bytea"` // داده‌های صوتی به صورت باینری
	CreatedAt time.Time
}

// تابعی برای راه‌اندازی کانکشن به PostgreSQL
func setupDatabase() *gorm.DB {
	dsn := "user=signal password=signal123 dbname=signaldb host=localhost port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}
	return db
}

// فانکشن برای ذخیره داده‌های صوتی در فایل
func saveAudioToFile(db *gorm.DB, id uuid.UUID, filePath string) {
	var audioData AudioData
	// بازیابی داده صوتی از پایگاه داده با استفاده از ID
	if err := db.First(&audioData, id).Error; err != nil {
		log.Println("Error retrieving audio data:", err)
		return
	}

	// باز کردن فایل برای نوشتن داده صوتی
	file, err := os.Create(filePath)
	if err != nil {
		log.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	// نوشتن داده صوتی در فایل
	_, err = file.Write(audioData.Data)
	if err != nil {
		log.Println("Error writing to file:", err)
		return
	}

	log.Printf("Audio data saved to file: %s\n", filePath)
}

func main() {
	// راه‌اندازی دیتابیس
	db := setupDatabase()

	// فراخوانی فانکشن برای ذخیره داده صوتی از دیتابیس در فایل
	// فرض کنید که ID داده صوتی که می‌خواهید بازیابی کنید، 1 است
	id := uuid.MustParse("846bfc79-7a6a-4131-b50f-0fd20dd4b54b")
	saveAudioToFile(db, id, "retrieved_audio.mp3")
}
