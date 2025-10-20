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

	stmt, err := repository.db.Prepare("INSERT INTO posts (description, author_id) VALUES (?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(post.Description, post.AuthorID)
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
        SELECT DISTINCT p.id, p.description, p.image, p.author_id, p.created_at, u.name, u.nick, u.avatar 
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
			&post.Description,
			&post.Image,
			&post.AuthorID,
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

		likes, err := repository.CountLikes(post.ID)
		if err != nil {
			return models.Posts{}, err
		}
		post.Likes = likes

		liked, err := repository.HasUserLikedPost(post.ID, userID)
		if err != nil {
			return models.Posts{}, err
		}
		post.LikedByUser = liked

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
			&post.Description,
			&post.Image,
			&post.AuthorID,
			&post.CreatedAt,
			&name,
			&nick,
			&avatar,
		); err != nil {
			return models.Post{}, err
		}

		likes, err := repository.CountLikes(post.ID)
		if err != nil {
			return models.Post{}, err
		}
		post.Likes = likes

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
			&post.Description,
			&post.Image,
			&post.AuthorID,
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

		likes, err := repository.CountLikes(post.ID)
		if err != nil {
			return models.Posts{}, err
		}
		post.Likes = likes

		posts = append(posts, post)
	}

	return posts, nil
}

// UpdatePostByIdRepository atualiza um post
func (repository post) UpdatePostByIdRepository(description, imagePath string, postID uint64) (models.Post, error) {

	stmt, err := repository.db.Prepare("UPDATE posts SET description = ?, image = ? WHERE id = ?")
	if err != nil {
		return models.Post{}, err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(description, imagePath, postID); err != nil {
		return models.Post{}, err
	}

	return repository.GetPostByIdRepository(postID)
}

// UpdatePostImageRepository atualiza só a image de um post (novo método)
func (repository post) UpdatePostImageRepository(postID uint64, imageFilename string) error {
	stmt, err := repository.db.Prepare("UPDATE posts SET image = ? WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(imageFilename, postID)
	return err
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

// CreateLike registra um like único
func (repository post) CreateLike(postID, userID uint64) error {
	stmt, err := repository.db.Prepare("INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(userID, postID)
	return err
}

func (repository post) DeleteLike(postID, userID uint64) error {
	stmt, err := repository.db.Prepare("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(userID, postID)
	return err
}

func (repository post) HasUserLikedPost(postID, userID uint64) (bool, error) {
	stmt, err := repository.db.Prepare("SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ? LIMIT 1")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(userID, postID)
	var exists int
	err = row.Scan(&exists)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return true, nil
}

func (repository post) CountLikes(postID uint64) (uint64, error) {
	stmt, err := repository.db.Prepare("SELECT COUNT(*) FROM post_likes WHERE post_id = ?")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	row := stmt.QueryRow(postID)
	var count uint64
	err = row.Scan(&count)
	return count, err
}
