package secret

import "golang.org/x/crypto/bcrypt"

// Hash criptografa a senha
func Hash(password string) ([]byte, error) {

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return hash, nil

}

// Verify verifica se a senha esta correta
func Verify(hash, password string) error {

	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))

	return err

}
