package models

import "time"

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
