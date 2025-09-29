package repositories

import (
	"api/src/models"
	"database/sql"
	"fmt"
)

type user struct {
	db *sql.DB
}

func UsersRopository(db *sql.DB) *user {
	return &user{db}
}

// CreateUserRepository insere um user no banco de dados
func (repository user) CreateUserRepository(user models.User) (uint64, error) {

	stmt, err := repository.db.Prepare("INSERT INTO users (name, nick, email, password) VALUES (?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(user.Name, user.Nick, user.Email, user.Password)
	if err != nil {
		return 0, err
	}

	lastID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return uint64(lastID), nil

}

// GetUsersByNameOrNickRepository busca usuários pelo nome ou nick no banco de dados
func (repository user) GetUsersByNameOrNickRepository(nameOrNick string) ([]models.User, error) {

	nameOrNick = fmt.Sprintf("%%%s%%", nameOrNick)

	stmt, err := repository.db.Prepare("SELECT id, name, nick, email, avatar created_at FROM users WHERE name LIKE ? OR nick LIKE ?")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.Query(nameOrNick, nameOrNick)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

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

// GetUserByIdRepository busca um usuário pelo ID no banco de dados
func (repository user) GetUserByIdRepository(ID uint64) (models.User, error) {

	stmt, err := repository.db.Prepare("SELECT id, name, nick, email, avatar, created_at FROM users WHERE id = ?")
	if err != nil {
		return models.User{}, err
	}
	defer stmt.Close()

	row, err := stmt.Query(ID)
	if err != nil {
		return models.User{}, err
	}
	defer row.Close()

	var user models.User
	if row.Next() {
		if err := row.Scan(
			&user.ID,
			&user.Name,
			&user.Nick,
			&user.Email,
			&user.Avatar,
			&user.CreatedAt,
		); err != nil {
			return models.User{}, err
		}
	} else {
		return models.User{}, fmt.Errorf("user com ID %d não encontrado", ID)
	}

	return user, nil

}

// GetUserByEmailRepository busca um usuário pelo email no banco de dados
func (repository user) GetUserByEmailRepository(email string) (models.User, error) {

	stmt, err := repository.db.Prepare("SELECT id, email, password FROM users WHERE email = ?")
	if err != nil {
		return models.User{}, err
	}
	defer stmt.Close()

	row, err := stmt.Query(email)
	if err != nil {
		return models.User{}, err
	}
	defer row.Close()

	var user models.User
	if row.Next() {
		if err := row.Scan(
			&user.ID,
			&user.Email,
			&user.Password,
		); err != nil {
			return models.User{}, err
		}
	} else {
		return models.User{}, fmt.Errorf("user com email %s nao encontrado", email)
	}

	return user, nil

}

// GetUserPasswordByIdRepository busca a senha de um usuário pelo ID
func (repository user) GetUserPasswordByIdRepository(ID uint64) (string, error) {

	stmt, err := repository.db.Prepare("SELECT password FROM users WHERE id = ?")
	if err != nil {
		return "", err
	}
	defer stmt.Close()

	row, err := stmt.Query(ID)
	if err != nil {
		return "", err
	}
	defer row.Close()

	var password string
	if row.Next() {
		if err := row.Scan(&password); err != nil {
			return "", err
		}
	} else {
		return "", fmt.Errorf("user com ID %d nao encontrado", ID)
	}

	return password, nil
}

// UpdateUserRepository atualiza um usuário no banco de dados
func (repository user) UpdateUserRepository(ID uint64, user models.User) (models.User, error) {

	if _, err := repository.GetUserByIdRepository(ID); err != nil {
		return models.User{}, err
	}

	stmt, err := repository.db.Prepare("UPDATE users SET name = ?, nick = ? WHERE id = ?")
	if err != nil {
		return models.User{}, err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(user.Name, user.Nick, ID); err != nil {
		return models.User{}, err
	}

	return repository.GetUserByIdRepository(ID)

}

// UpdateUserPasswordRepository atualiza a senha de um usuário
func (repository user) UpdateUserPasswordRepository(userID uint64, passwordHash string) error {

	stmt, err := repository.db.Prepare("UPDATE users SET password = ? WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(passwordHash, userID); err != nil {
		return err
	}

	return nil

}

// UpdateUserAvatarRepository atualiza o avatar de um usuário
func (repository user) UpdateUserAvatarRepository(ID uint64, avatarPath string) error {

	stmt, err := repository.db.Prepare("UPDATE users SET avatar = ? WHERE id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(avatarPath, ID)

	return err

}

// DeleteUserByIdRepository deleta um usuário do banco de dados
func (repository user) DeleteUserByIdRepository(ID uint64) (bool, error) {

	stmt, err := repository.db.Prepare("DELETE FROM users WHERE id = ?")
	if err != nil {
		return false, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(ID)
	if err != nil {
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	if rowsAffected == 0 {
		return false, fmt.Errorf("nenhum usuário com ID %d foi encontrado para deletar", ID)
	}

	return true, nil

}
