package handler

import (
	"log"
	"net/http"
	"os"

	"signal/internal/auth/model"
	"signal/internal/auth/repository"
	"signal/internal/service"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	model.User
}

func (u *User) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (u *User) CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Login godoc
// @Summary User Login
// @Description Login user
// @Tags User
// @Accept  json
// @Produce  json
// @Param email body string true "User's email"
// @Param password body string true "User's password"
// @Success 200 {string} string "User created successfully"
// @Failure 400 {string} string "Bad Request"
// @Router /api/v1/login [post]

func (u *User) Login(c *fiber.Ctx, repo *repository.UserRepository, jwtService *service.JWTService) error {
	login := new(struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	})

	if err := c.BodyParser(login); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "ورودی معتبر نیست"})
	}

	user, err := repo.GetUserByEmail(login.Email)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "کاربر یافت نشد"})
	}

	if !u.CheckPasswordHash(login.Password, user.Password) {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "پسورد اشتباه است"})
	}

	token, err := u.GenerateJWT(user.Email)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "خطا در ایجاد توکن"})
	}

	return c.JSON(fiber.Map{"token": token})
}

// Signup godoc
// @Summary User signup
// @Description Register a new user
// @Tags User
// @Accept  json
// @Produce  json
// @Param name body string true "User's name"
// @Param email body string true "User's email"
// @Param password body string true "User's password"
// @Success 200 {string} string "User created successfully"
// @Failure 400 {string} string "Bad Request"
// @Router /api/v1/signup [post]

func (u *User) SignUp(c *fiber.Ctx, repo *repository.UserRepository) error {
	user := new(model.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "ورودی معتبر نیست"})
	}

	// v := NewValidation()
	// if err := v.ValidateSignUp(u); err != nil {
	// 	return c.Status(fiber.StatusBadRequest).SendString(fmt.Sprintf("Validation error: %s", err.Error()))
	// }

	hashedPassword, err := u.HashPassword(user.Password)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "خطا در ذخیره پسورد"})
	}

	user.Password = hashedPassword
	if err := repo.CreateUser(user); err != nil {
		log.Println("خطا در ایجاد کاربر:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "خطا در ثبت نام"})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{"status": "201", "message": "User created !"})
}

func (u *User) GenerateJWT(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = username
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// func (u *User) GetAllUsers(c *fiber.Ctx) ([]User, error) {
// 	users, err := GetAllUsers()
// 	if err != nil {
// 		return c.Status(500).JSON(fiber.Map{"error": "Error retrieving users"})
// 	}
// 	return c.JSON(users)
// }
