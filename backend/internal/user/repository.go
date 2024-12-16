package user

import (
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *User) error {
	if err := r.DB.Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) FindByEmail(email string) (*User, error) {
	var user User
	err := r.DB.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) GetUserByEmail(email string) (*User, error) {
	var user User
	if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetAllUsers() ([]User, error) {
	var users []User
	if err := r.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) GetUserByID(id string) (User, error) {
	var user User
	if err := r.DB.Find(&user).Error; err != nil {
		return User{}, err
	}
	return user, nil
}

func (r *UserRepository) DeleteUser(user User) error {
	if err := r.DB.Delete(&user).Error; err != nil {
		return err
	}
	return nil
}
