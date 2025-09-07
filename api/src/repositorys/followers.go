package repositorys

import (
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
