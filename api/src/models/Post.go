package models

import (
	"errors"
	"strings"
	"time"
)

// Post representa uma publicação
type Post struct {
	ID          uint64      `json:"id,omitempty"`
	Description string      `json:"description,omitempty"`
	Image       string      `json:"image,omitempty"`
	AuthorID    uint64      `json:"author_id,omitempty"`
	Likes       uint64      `json:"likes"`
	LikedByUser bool        `json:"likedByUser"`
	CreatedAt   time.Time   `json:"created_at,omitempty"`
	Author      UserSummary `json:"user"`
}

type UserSummary struct {
	Name   string `json:"name"`
	Nick   string `json:"nick"`
	Avatar string `json:"avatar"`
}

// Posts representa uma lista de publicações
type Posts []Post

// Prepare formatar o post
func (post *Post) Prepare() error {

	post.format()

	if err := post.validationDescription(); err != nil {
		return err
	}

	return nil

}

// Validation verifica se os campos do usuário estão preenchidos
func (post *Post) validationDescription() error {

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

	post.Description = strings.TrimSpace(post.Description)

}
