package common

import (
	"time"

	"github.com/google/uuid"
)

type AudioData struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	ClientID  string     `json:"client_id"`
	Data      []byte     `json:"audio"`
	IP        string     `json:"ip"`
	Port      int        `json:"port"`
	Duration  float64    `json:"duration"`
	CreatedAt time.Time  `gorm:"autoCreateTime"`
	UpdatedAt time.Time  `gorm:"autoUpdateTime"`
	DeletedAt *time.Time `gorm:"index"`
}
