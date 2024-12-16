package database

import (
	"log"
	config "signal/configs"
	"signal/internal/udp"
	"signal/internal/user"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	cfg := config.GetConfig()

	db, err := gorm.Open(postgres.Open(cfg.DSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database %v", err)
	}
	if err := db.AutoMigrate(
		&user.User{},
		&user.Rol{},
		&udp.Message{},
		&udp.AudioData{},
		&udp.ClientInfo{},
	); err == nil {
		log.Println("Create user model successfuly")
	} else {
		log.Fatalf("Error auto migrate: %v", err)
	}
	return db
}
