package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"api/src/secret"
	"api/src/utils"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// AuthLoginController autentica um usuário e retorna um token JWT
func AuthLoginController(w http.ResponseWriter, r *http.Request) {

	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)
		return
	}

	var user models.User
	if err := json.Unmarshal(bodyRequest, &user); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}

	if user.Nick == "" && user.Email == "" {
		responses.Erro(w, http.StatusBadRequest, fmt.Errorf("nick ou email é obrigatório"))
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	var userResponse models.User

	if user.Nick != "" {
		userResponse, err = repository.GetUserByNickRepository(user.Nick)
		if err != nil {
			if user.Email != "" {
				userResponse, err = repository.GetUserByEmailRepository(user.Email)
			}
		}
	} else {
		userResponse, err = repository.GetUserByEmailRepository(user.Email)
	}

	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, fmt.Errorf("credenciais inválidas"))
		return
	}

	if err := secret.Verify(userResponse.Password, user.Password); err != nil {
		responses.Erro(w, http.StatusUnauthorized, fmt.Errorf("credenciais inválidas"))
		return
	}

	token, err := auth.CreateToken(userResponse.ID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Autenticado com sucesso", token)

}

// RegisterUserController registra um novo usuário
func RegisterUserController(w http.ResponseWriter, r *http.Request) {

	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)

		return
	}

	var user models.User

	if err := json.Unmarshal(bodyRequest, &user); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if err = user.Prepare("create"); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	user.ID, err = repository.CreateUserRepository(user)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusCreated, "Usuario registrado com sucesso", user)

}

// ForgotPasswordController envia uma nova senha para o email do usuário
func ForgotPasswordController(w http.ResponseWriter, r *http.Request) {
	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)
		return
	}

	var body struct {
		Email string `json:"email"`
	}

	if err := json.Unmarshal(bodyRequest, &body); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	user, err := repository.GetUserByEmailRepository(body.Email)
	if err != nil {
		responses.Erro(w, http.StatusNotFound, fmt.Errorf("email não encontrado"))
		return
	}

	novaSenha := utils.GenerateRandomPassword(10)
	hash, err := secret.Hash(novaSenha)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	err = repository.UpdateUserPasswordRepository(user.ID, string(hash))
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	err = utils.SendEmail(body.Email, "Recuperação de senha", novaSenha)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Nova senha enviada para seu email", nil)
}
