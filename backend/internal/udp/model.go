package udp

import (
	"time"

	"github.com/google/uuid"
)

// type UDPServer struct {
// 	conn      *net.UDPConn
// 	clients   map[string]*ClientInfo
// 	jobs      chan []byte
// 	mu        sync.Mutex
// 	db        *gorm.DB
// 	CreatedAt time.Time `gorm:"autoCreateTime"`
// 	UpdatedAt time.Time `gorm:"autoUpdateTime"`
// 	DeletedAt *time.Time
// }

type Message struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	ClientID  string    `json:"client_id" gorm:"type:text"`
	Message   string    `json:"message" gorm:"type:text"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}

type AudioData struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	ClientID  string    `json:"client_id" gorm:"type:text"`
	Data      []byte    `json:"audio" gorm:"type:bytea"`
	IP        string    `gorm:"type:varchar(15)"` // ذخیره آدرس IP
	Port      int       `gorm:"type:int"`         // ذخیره شماره پورت
	Duration  float64   `gorm:"type:float"`       // ذخیره مدت زمان فایل صوتی
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	DeletedAt *time.Time
}

type ClientInfo struct {
	ID         uuid.UUID   `json:"id" gorm:"type:uuid;default:gen_random_uuid()"`
	Address    string      `json:"address"`
	LastActive time.Time   `json:"last_active" gorm:"autoUpdateTime"`
	Timer      *time.Timer `gorm:"-" json:"-"` // این فیلد در پایگاه داده ذخیره نمی‌شود
	CreatedAt  time.Time   `gorm:"autoCreateTime"`
	UpdatedAt  time.Time   `gorm:"autoUpdateTime"`
	DeletedAt  *time.Time  `gorm:"index"`
}
