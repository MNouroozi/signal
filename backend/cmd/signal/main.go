package main

import (
	"log"
	"time"

	config "signal/configs"
	db "signal/internal/database"
	"signal/internal/router"
	"signal/internal/service"
	"signal/internal/udp"
	"signal/internal/user"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// @title Example API
// @version 0.1.0
// @description داکیومنت برنامه سیگنال
// @host localhost:3000
// @BasePath /api/v1

func main() {
	cfg := config.GetConfig()

	dbConn := db.ConnectDB()
	if dbConn == nil {
		log.Fatal("error connectiing to")
	}

	go udp.ProcessAudioQueue(dbConn)
	go udp.StartUDPServer()

	userRepo := user.NewUserRepository(dbConn)
	audioRepo := udp.NewAudioDataRepository(dbConn)

	sqlDB, err := dbConn.DB()
	if err != nil {
		log.Fatal("خطا در دریافت اتصال SQL:", err)
	}
	defer sqlDB.Close()

	log.Println("Database has connected ... ✅")
	jwtService := service.NewJWTService("supersecretkey", time.Hour*24)
	log.Println("JWT successfuly initiat ✅")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	router.SetupRoutes(app, userRepo, audioRepo, jwtService)
	log.Fatal(app.Listen(":" + cfg.HTTPPort))
	log.Printf("Server HTTP on port  %v has running ✅", cfg.HTTPPort)

}
