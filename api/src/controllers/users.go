package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"api/src/secret"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

// GetUsersController busca todos os usuários por name or nick
func GetUsersByNameOrNickController(w http.ResponseWriter, r *http.Request) {

	nameOrNick := strings.ToLower(r.URL.Query().Get("nameOrNick"))

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	users, err := repository.GetUsersByNameOrNickRepository(nameOrNick)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Usuarios encontrados com sucesso", users)

}

// GetUsersByIdController busca um usuário
func GetUsersByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
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

	user, err := repository.GetUserByIdRepository(userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Usuario encontrado com sucesso", user)

}

// UpdateUserByIdController atualiza um usuário
func UpdateUserByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	if userID != userIdToken {
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para atualizar outro usuario"))

		return
	}

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

	if err = user.Prepare("update"); err != nil {
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

	userResponse, err := repository.UpdateUserRepository(userID, user)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Usuario atualizado com sucesso", userResponse)

}

// UpdateUserPasswordByIdController atualiza a senha de um usuário
func UpdateUserPasswordByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	if userID != userIdToken {
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para atualizar a senha de outro usuario"))

		return
	}

	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)

		return
	}

	var password models.UserUpdatePassword

	if err := json.Unmarshal(bodyRequest, &password); err != nil {
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

	passwordSaveDB, err := repository.GetUserPasswordByIdRepository(userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	if err := secret.Verify(passwordSaveDB, password.CurrentPassword); err != nil {
		responses.Erro(w, http.StatusUnauthorized, errors.New("senha atual incorreta"))

		return
	}

	passwordHash, err := secret.Hash(password.NewPassword)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	if err := repository.UpdateUserPasswordRepository(userID, string(passwordHash)); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Senha atualizada com sucesso", nil)

}

// DeleteUserByIdController deleta um usuário
func DeleteUserByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	if userID != userIdToken {
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para deletar outro usuario"))

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	if _, err := repository.DeleteUserByIdRepository(userID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Usuario deletado com sucesso", nil)

}
