package postgers

import (
	"log"

	"gorm.io/gorm"
)

func SaveAudioLog(db *gorm.DB, audioLog AudioLog) error {
	if err := db.Create(&audioLog).Error; err != nil {
		log.Printf("Error saving audio log: %v", err)
		return err
	}
	log.Println("Audio log saved to PostgreSQL.")
	return nil
}
