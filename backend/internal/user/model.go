package user

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	Name      string    `json:"name" gorm:"size:100;not null" validate:"required,min=4,max=50"`
	Email     string    `json:"email" gorm:"unique;not null" validate:"required,email"`
	Password  string    `json:"password" gorm:"not null" validate:"required,min=6,max=50"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}

type Rol struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	Rol       string    `json:"name" gorm:"size:20;not null" validate:"required,min=4,max=20"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}
