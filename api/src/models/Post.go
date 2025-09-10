package models

import (
	"errors"
	"strings"
	"time"
)

// Post representa uma publicação
type Post struct {
	ID          uint64    `json:"id,omitempty"`
	Title       string    `json:"title,omitempty"`
	Description string    `json:"description,omitempty"`
	AuthorID    uint64    `json:"author_id,omitempty"`
	AuthorNick  string    `json:"author_nick,omitempty"`
	Likes       uint64    `json:"likes"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
}

// Posts representa uma lista de publicações
type Posts []Post

// Prepare formatar o post
func (post *Post) Prepare() error {

	post.format()

	if err := post.validation(); err != nil {
		return err
	}

	return nil

}

// Validation verifica se os campos do usuário estão preenchidos
func (post *Post) validation() error {

	// Validation title
	if post.Title == "" {
		return errors.New("o campo title é obrigatório")
	}
	if len(post.Title) < 3 {
		return errors.New("o campo title deve ter no mínimo 3 caracteres")
	}

	// Validation description
	if post.Description == "" {
		return errors.New("o campo description é obrigatório")
	}
	if len(post.Description) < 10 {
		return errors.New("o campo description deve ter no mínimo 10 caracteres")
	}

	return nil
}

// Format remove os espaços em branco dos campos
func (post *Post) format() {

	post.Title = strings.TrimSpace(post.Title)
	post.Description = strings.TrimSpace(post.Description)

}
