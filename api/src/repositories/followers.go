package repositories

import (
	"api/src/models"
	"database/sql"
)

func FollowersUsersRopository(db *sql.DB) *user {
	return &user{db}
}

// FollowerRopository insere um follower no banco de dados
func (repository user) FollowUserRopository(userID, followID uint64) error {

	stmt, err := repository.db.Prepare("INSERT IGNORE INTO followers (user_id, follower_id) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(userID, followID); err != nil {
		return err
	}

	return nil

}

// FollowerRopository insere um follower no banco de dados
func (repository user) UnfollowUserRepository(userID, followerID uint64) error {
	stmt, err := repository.db.Prepare("DELETE FROM followers WHERE user_id = ? AND follower_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(userID, followerID); err != nil {
		return err
	}

	return nil
}

// ConnectionsUserRepository retorna todos os usuários conectados (seguidores + seguindo) sem duplicação
func (repository user) ConnectionsUserRepository(userID uint64) (models.Users, error) {

	unique := make(map[uint64]bool)
	var connections models.Users

	followers, err := repository.FollowersUserRepository(userID)
	if err != nil {
		return nil, err
	}
	for _, user := range followers {
		if !unique[user.ID] {
			unique[user.ID] = true
			connections = append(connections, user)
		}
	}

	following, err := repository.FollowingUserRepository(userID)
	if err != nil {
		return nil, err
	}
	for _, user := range following {
		if !unique[user.ID] {
			unique[user.ID] = true
			connections = append(connections, user)
		}
	}

	return connections, nil
}

// FollowersUserRepository busca os seguidores de um user
func (repository user) FollowersUserRepository(userID uint64) (models.Users, error) {

	rows, err := repository.db.Query(`
		SELECT u.id, u.name, u.nick, u.email, u.avatar, u.created_at FROM users u
		INNER JOIN followers f
		ON u.id = f.follower_id
		WHERE f.user_id = ?
	`, userID)
	if err != nil {
		return nil, err
	}

	var users models.Users

	for rows.Next() {
		var user models.User

		if err = rows.Scan(
			&user.ID,
			&user.Name,
			&user.Nick,
			&user.Email,
			&user.Avatar,
			&user.CreatedAt,
		); err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}

// FollowingUserRepository busca os users que um user segue
func (repository user) FollowingUserRepository(userID uint64) (models.Users, error) {

	rows, err := repository.db.Query(`
		SELECT u.id, u.name, u.nick, u.email, u.avatar, u.created_at FROM users u
		INNER JOIN followers f
		ON u.id = f.user_id
		WHERE f.follower_id = ?
	`, userID)
	if err != nil {
		return nil, err
	}

	var users models.Users

	for rows.Next() {
		var user models.User

		if err = rows.Scan(
			&user.ID,
			&user.Name,
			&user.Nick,
			&user.Email,
			&user.Avatar,
			&user.CreatedAt,
		); err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}
