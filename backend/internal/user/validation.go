package user

import (
	"github.com/go-playground/validator/v10"
)

type Validation struct {
	Validator *validator.Validate
}

func NewValidation() *Validation {
	return &Validation{
		Validator: validator.New(),
	}
}

func (v *Validation) ValidateSignUp(signupRequest *User) error {
	return v.Validator.Struct(signupRequest)
}

func (v *Validation) ValidateLogin(loginRequest *User) error {
	return v.Validator.Struct(loginRequest)
}
