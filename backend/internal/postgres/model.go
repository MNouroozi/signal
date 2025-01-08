package postgers

import (
	"time"

	"github.com/google/uuid"
)

type AudioLog struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	IP        string    `gorm:"index"`
	Port      int
	Duration  float64
	FileName  string
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}
