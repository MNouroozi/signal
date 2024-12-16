package udp

import (
	"log"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func saveAudioData(db *gorm.DB, audio []byte, ip string, port int, duration float64) {
	data := AudioData{
		ID:        uuid.New(),
		Data:      audio,
		CreatedAt: time.Now(),
		IP:        ip,
		Port:      port,
		Duration:  duration,
	}

	tx := db.Begin()
	if err := tx.Create(&data).Error; err != nil {
		tx.Rollback()
		log.Println("Error saving audio data:", err)
		return
	}
	tx.Commit()
}
