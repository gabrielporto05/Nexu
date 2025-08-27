package models

import (
	"api/src/secret"
	"errors"
	"strings"
	"time"

	"github.com/badoux/checkmail"
)

// User representa um usuário da aplicação
type User struct {
	ID        uint64    `json:"id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Nick      string    `json:"nick,omitempty"`
	Email     string    `json:"email,omitempty"`
	Password  string    `json:"password,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

// Users representa uma lista de usuários
type Users []User

// Prepare formatar o usuário
func (user *User) Prepare(stage string) error {

	if err := user.validation(stage); err != nil {
		return err
	}

	if err := user.format(stage); err != nil {
		return err
	}

	return nil

}

// Validation verifica se os campos do usuário estão preenchidos
func (user *User) validation(stage string) error {

	// Validation name
	if user.Name == "" {
		return errors.New("o campo name é obrigatório")
	}
	if len(user.Name) < 3 {
		return errors.New("o campo name deve ter no mínimo 3 caracteres")
	}

	// Validation nick
	if user.Nick == "" {
		return errors.New("o campo nick é obrigatório")
	}
	if len(user.Nick) < 3 {
		return errors.New("o campo nick deve ter no mínimo 3 caracteres")
	}

	if stage == "create" {

		// Validation email
		if user.Email == "" {
			return errors.New("o campo email é obrigatório")
		}
		if !strings.Contains(user.Email, "@") || !strings.Contains(user.Email, ".") {
			return errors.New("o campo email inválido")
		}
		if err := checkmail.ValidateFormat(user.Email); err != nil {
			return errors.New("campo email inválido")
		}

		// Validation password
		if user.Password == "" {
			return errors.New("o campo password é obrigatório")
		}
		if len(user.Password) < 8 {
			return errors.New("a senha deve ter no mínimo 8 caracteres")
		}
		if !containsLetter(user.Password) {
			return errors.New("a senha deve conter pelo menos uma letra")
		}
		if !containsNumber(user.Password) {
			return errors.New("a senha deve conter pelo menos um número")
		}

	}

	return nil
}

// Format remove os espaços em branco dos campos
func (user *User) format(stage string) error {

	user.Name = strings.TrimSpace(user.Name)
	user.Nick = strings.TrimSpace(user.Nick)
	user.Email = strings.TrimSpace(user.Email)

	if stage == "create" {

		hash, err := secret.Hash(user.Password)
		if err != nil {
			return err
		}

		user.Password = string(hash)

	}

	return nil

}

// ContainsLetter verifica se a string possui pelo menos uma letra
func containsLetter(s string) bool {
	for _, r := range s {
		if ('a' <= r && r <= 'z') || ('A' <= r && r <= 'Z') {
			return true
		}
	}
	return false
}

// ContainsNumber verifica se a string possui pelo menos um número
func containsNumber(s string) bool {
	for _, r := range s {
		if '0' <= r && r <= '9' {
			return true
		}
	}
	return false
}
