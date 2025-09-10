package repositories

import (
	"api/src/models"
	"database/sql"
	"fmt"
)

type post struct {
	db *sql.DB
}

func PostsRopository(db *sql.DB) *post {
	return &post{db}
}

// CreatePostRepository insere um post no banco de dados
func (repository post) CreatePostRepository(post models.Post) (uint64, error) {

	stmt, err := repository.db.Prepare("INSERT INTO posts (title, description, author_id) VALUES (?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(post.Title, post.Description, post.AuthorID)
	if err != nil {
		return 0, err
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint64(lastID), nil
}

func (repository post) GetPostByIdRepository(postID uint64) (models.Post, error) {

	stmt, err := repository.db.Prepare(`
		SELECT p.*, u.nick FROM posts p
		INNER JOIN users u 
		ON u.id = p.author_id 
		WHERE p.id = ?
	`)
	if err != nil {
		return models.Post{}, err
	}
	defer stmt.Close()

	row, err := stmt.Query(postID)
	if err != nil {
		return models.Post{}, err
	}
	defer row.Close()

	var post models.Post
	if row.Next() {
		if err := row.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.AuthorID,
			&post.Likes,
			&post.CreatedAt,
			&post.AuthorNick,
		); err != nil {
			return models.Post{}, err
		}
	} else {
		return models.Post{}, fmt.Errorf("post com ID %d nao encontrado", postID)
	}

	return post, nil

}
