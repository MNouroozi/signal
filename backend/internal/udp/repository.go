package udp

import (
	"signal/internal/common"

	"gorm.io/gorm"
)

type AudioDataRepository struct {
	DB *gorm.DB
}

func NewAudioDataRepository(db *gorm.DB) *AudioDataRepository {
	return &AudioDataRepository{DB: db}
}

func (r *AudioDataRepository) GetAllAudioData() ([]common.AudioData, error) {
	var audios []common.AudioData
	if err := r.DB.Find(&audios).Error; err != nil {
		return nil, err
	}
	return audios, nil
}
