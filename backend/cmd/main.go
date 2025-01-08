package main

import (
	"log"
	"time"

	config "signal/config"
	"signal/internal/connection"
	"signal/internal/kafka"
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

	dbConn := connection.ConnectDB()
	if dbConn == nil {
		log.Fatal("error connecting to database")
	}

	go udp.ProcessAudioQueue(dbConn)
	go udp.StartUDPServer()

	userRepo := user.NewUserRepository(dbConn)
	audioRepo := udp.NewAudioDataRepository(dbConn)

	sqlDB, err := dbConn.DB()
	if err != nil {
		log.Fatal("error connecting to sql database:", err)
	}
	defer sqlDB.Close()

	go func() {
		kafka.InitKafkaConsumer([]string{"localhost:9092"})
	}()

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
	log.Fatal(app.Listen(":" + cfg.TCP_Port))
	log.Printf("Server HTTP on port  %v has running ✅", cfg.TCP_Port)

}
