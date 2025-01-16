package router

import (
	"encoding/base64"
	"fmt"
	"signal/internal/auth/handler"
	"signal/internal/auth/repository"
	"signal/internal/proxy"
	"signal/internal/service"
	"signal/internal/udp"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

func SetupRoutes(app *fiber.App, userRepo *repository.UserRepository, audioRepo *udp.AudioDataRepository, jwtService *service.JWTService) {

	api := app.Group("/api/v1")

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	app.Use(func(c *fiber.Ctx) error {
		fmt.Println("Request Method:", c.Method(), "Request URL:", c.OriginalURL())
		return c.Next()
	})

	api.Post("/signup", func(c *fiber.Ctx) error {
		handler := handler.User{}
		return handler.SignUp(c, userRepo)
	})

	api.Post("/login", func(c *fiber.Ctx) error {
		handler := handler.User{}
		return handler.Login(c, userRepo, jwtService)
	})

	api.Get("/users", func(c *fiber.Ctx) error {
		users, err := userRepo.GetAllUsers()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Error retrieving users"})
		}
		return c.JSON(users)
	})

	api.Get(
		"/getUserById",
		func(c *fiber.Ctx) error {
			id := c.Params("ID")
			user, err := userRepo.GetUserByID(id)
			if err != nil {
				return c.Status(500).JSON(fiber.Map{"error": "Error find user", "id": user.ID})
			}
			return c.JSON(user)
		},
	)

	api.Delete("/deleteUser", func(c *fiber.Ctx) error {
		user, err := userRepo.GetUserByID(c.Params("ID"))
		fmt.Println(user)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Error find user", "id": user.ID})
		}

		err = userRepo.DeleteUser(user)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Error delete user"})
		}

		return c.JSON("200")
	})

	api.Get("/getAllAudio", func(c *fiber.Ctx) error {
		audios, err := audioRepo.GetAllAudioData()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Error retrieving audios"})
		}

		// ایجاد یک آرایه برای ذخیره پاسخ با داده‌های Base64
		var response []map[string]interface{}
		for _, audio := range audios {
			// تبدیل داده‌های صوتی به Base64
			encodedAudio := base64.StdEncoding.EncodeToString(audio.Data)
			response = append(response, map[string]interface{}{
				"id":        audio.ID,
				"client_id": audio.ClientID,
				"data":      encodedAudio, // ارسال داده به صورت Base64
				"ip":        audio.IP,
				"port":      audio.Port,
				"duration":  audio.Duration,
				"createdAt": audio.CreatedAt,
				"updatedAt": audio.UpdatedAt,
			})
		}

		return c.JSON(response)
	})

	api.Post("/sendAudio", func(c *fiber.Ctx) error {
		file, err := c.FormFile("audio")
		if err != nil {
			return c.Status(400).SendString("خطا در دریافت فایل")
		}

		audioFile, err := file.Open()
		if err != nil {
			return c.Status(500).SendString("خطا در باز کردن فایل")
		}
		defer audioFile.Close()

		audioData := make([]byte, file.Size)
		_, err = audioFile.Read(audioData)
		if err != nil {
			return c.Status(500).SendString("Error reading audio")
		}

		proxy.SendDataToUDP("AUDIO", audioData)
		return c.SendString("Audio data recived and send")
	})

	api.Post("/sendMessage", func(c *fiber.Ctx) error {
		type MessageRequest struct {
			Message string `json:"message"`
		}

		var request MessageRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(400).SendString("Error data procesing")
		}

		proxy.SendDataToUDP("MESSAGE", []byte(request.Message))
		return c.SendString("Message data send .")
	})

	api.Get("/swagger/*", swagger.HandlerDefault)

}
