package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositorys"
	"api/src/responses"
	"api/src/secret"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

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

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositorys.UsersRopository(db)

	userResponse, err := repository.GetUserByEmailRepository(user.Email)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	if err := secret.Verify(userResponse.Password, user.Password); err != nil {
		responses.Erro(w, http.StatusUnauthorized, fmt.Errorf("email ou senha incorretos"))

		return
	}

	token, err := auth.CreateToken(userResponse.ID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Autenticado com sucesso", token)

}

func AuthRegisterController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Registrado com sucesso", nil)

}
