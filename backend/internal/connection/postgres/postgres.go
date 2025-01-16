package connection

import (
	"log"
	config "signal/config"
	"signal/internal/auth/model"
	"signal/internal/common"
	postgers "signal/internal/postgres"
	"signal/internal/udp"

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
		&postgers.AudioLog{},
		&model.User{},
		&model.Role{},
		&model.Permission{},
		&udp.Message{},
		&udp.Devices{},
		&common.AudioData{},
	); err == nil {
		log.Println("Create user model successfuly")
	} else {
		log.Fatalf("Error auto migrate: %v", err)
	}
	return db
}
