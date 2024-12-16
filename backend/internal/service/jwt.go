package service

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct {
	secretKey     string
	tokenDuration time.Duration
}

func NewJWTService(secretKey string, duration time.Duration) *JWTService {
	return &JWTService{
		secretKey:     secretKey,
		tokenDuration: duration,
	}
}

func (s *JWTService) GenerateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(s.tokenDuration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secretKey))
}
