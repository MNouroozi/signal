package postgers

import "time"

type AudioLog struct {
	ID        uint   `gorm:"primaryKey"`
	IP        string `gorm:"index"`
	Port      int
	Duration  float64
	FileName  string
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}
