package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

// CreateUserController cria um usuário
func CreateUserController(w http.ResponseWriter, r *http.Request) {

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

	responses.JSON(w, http.StatusCreated, "User criado com sucesso", user)

}

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

	responses.JSON(w, http.StatusOK, "Users encontrados com sucesso", users)

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

	responses.JSON(w, http.StatusOK, "User encontrado com sucesso", user)

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
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para atualizar outro user"))

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

	responses.JSON(w, http.StatusOK, "User atualizado com sucesso", userResponse)

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
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para deletar outro user"))

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

	responses.JSON(w, http.StatusOK, "User deletado com sucesso", nil)

}
