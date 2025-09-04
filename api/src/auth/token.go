package auth

import (
	"api/src/config"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// CreateToken cria um token com as permissoes do user
func CreateToken(userID uint64) (string, error) {

	permissions := jwt.MapClaims{}
	permissions["authorized"] = true
	permissions["exp"] = time.Now().Add(time.Hour).Unix()
	permissions["userID"] = userID

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, permissions)

	return token.SignedString([]byte(config.SecretKey))

}

// ValidateToken valida se o token é válido
func ValidateToken(r *http.Request) error {

	tokenString := extractToken(r)

	token, err := jwt.Parse(tokenString, returnKeyVerification)
	if err != nil {
		return err
	}

	if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return nil
	}

	return errors.New("token inválido")

}

// extractToken extrai o token do header
func extractToken(r *http.Request) string {

	bearerToken := r.Header.Get("Authorization")

	if len(strings.Split(bearerToken, " ")) < 2 {

		return ""
	}

	token := strings.Split(bearerToken, " ")[1]

	return token

}

// ExtractUserIdToken extrai o id do user do token
func ExtractUserIdToken(r *http.Request) (uint64, error) {

	tokenString := extractToken(r)

	token, err := jwt.Parse(tokenString, returnKeyVerification)
	if err != nil {

		return 0, err
	}

	if permissions, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, err := strconv.ParseUint(fmt.Sprintf("%.0f", permissions["userID"]), 10, 64)
		if err != nil {

			return 0, err
		}

		return userID, nil
	}

	return 0, errors.New("token inválido")

}

// returnKeyVerification retorna a chave de assinatura
func returnKeyVerification(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {

		return nil, fmt.Errorf("método de assinatura inesperado: %v", token.Header["alg"])
	}

	return config.SecretKey, nil

}
