package repositories

import (
	"api/src/models"
	"database/sql"
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

func (repository post) GetPostsRepository(userID uint64) (models.Posts, error) {

	stmt, err := repository.db.Prepare(`
        SELECT DISTINCT p.id, p.title, p.description, p.author_id, p.likes, p.created_at, u.name, u.nick, u.avatar 
        FROM posts p
        INNER JOIN users u ON u.id = p.author_id
        LEFT JOIN followers f ON f.user_id = p.author_id
        WHERE p.author_id = ? OR f.follower_id = ?
        ORDER BY p.created_at DESC
    `)
	if err != nil {
		return models.Posts{}, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(userID, userID)
	if err != nil {
		return models.Posts{}, err
	}
	defer rows.Close()

	var posts models.Posts

	for rows.Next() {
		var post models.Post
		var name, nick, avatar string

		if err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.AuthorID,
			&post.Likes,
			&post.CreatedAt,
			&name,
			&nick,
			&avatar,
		); err != nil {
			return models.Posts{}, err
		}

		post.Author = models.UserSummary{
			Name:   name,
			Nick:   nick,
			Avatar: avatar,
		}

		posts = append(posts, post)
	}

	return posts, nil

}

func (repository post) GetPostByIdRepository(postID uint64) (models.Post, error) {

	stmt, err := repository.db.Prepare(`
		SELECT p.*, u.name, u.nick, u.avatar FROM posts p
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
	for row.Next() {
		var name, nick, avatar string

		if err := row.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.AuthorID,
			&post.Likes,
			&post.CreatedAt,
			&name,
			&nick,
			&avatar,
		); err != nil {
			return models.Post{}, err
		}

		post.Author = models.UserSummary{
			Name:   name,
			Nick:   nick,
			Avatar: avatar,
		}

	}

	return post, nil

}

// GetAllPostsByIdRepository retorna todos os posts de um usuário
func (repository post) GetAllPostsByIdRepository(userID uint64) (models.Posts, error) {

	stmt, err := repository.db.Prepare(`
		SELECT DISTINCT p.*, u.name, u.nick, u.avatar 
		FROM posts p
		INNER JOIN users u ON u.id = p.author_id
		WHERE p.author_id = ? 
		ORDER BY 1 DESC
	`)
	if err != nil {
		return models.Posts{}, err
	}
	defer stmt.Close()

	row, err := stmt.Query(userID)
	if err != nil {
		return models.Posts{}, err
	}
	defer row.Close()

	var posts models.Posts

	for row.Next() {
		var post models.Post
		var name, nick, avatar string

		if err := row.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.AuthorID,
			&post.Likes,
			&post.CreatedAt,
			&nick,
			&name,
			&avatar,
		); err != nil {
			return models.Posts{}, err
		}

		post.Author = models.UserSummary{
			Name:   name,
			Nick:   nick,
			Avatar: avatar,
		}

		posts = append(posts, post)
	}

	return posts, nil
}

// UpdatePostByIdRepository atualiza um post
func (repository post) UpdatePostByIdRepository(title, description string, postID uint64) (models.Post, error) {

	stmt, err := repository.db.Prepare("UPDATE posts SET title = ?, description = ? WHERE id = ?")
	if err != nil {
		return models.Post{}, err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(title, description, postID); err != nil {
		return models.Post{}, err
	}

	return repository.GetPostByIdRepository(postID)
}

// DeletePostByIdRepository deleta um post
func (repository post) DeletePostByIdRepository(postID uint64) error {

	stmt, err := repository.db.Prepare("DELETE FROM posts WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(postID); err != nil {
		return err
	}

	return nil
}

// LikePostRepository da like em um post
func (repository post) LikePostRepository(postID uint64) error {

	stmt, err := repository.db.Prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(postID); err != nil {
		return err
	}

	return nil
}

// UnlikePostRepository da unlike em um post
func (repository post) UnlikePostRepository(postID uint64) error {

	stmt, err := repository.db.Prepare(`
		UPDATE posts SET likes = 
		CASE 
			WHEN likes > 0 THEN likes - 1 
			ELSE 0 
		END
	 	WHERE id = ?`,
	)
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(postID); err != nil {
		return err
	}

	return nil
}
