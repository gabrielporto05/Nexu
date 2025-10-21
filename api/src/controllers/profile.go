package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/repositories"
	"api/src/responses"
	"fmt"
	"io"
	"net/http"
	"os"
)

// GetProfileController busca o perfil
func GetProfileController(w http.ResponseWriter, r *http.Request) {

	userID, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)

	user, err := repository.GetUserByIdRepository(userID, userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Perfil encontrado com sucesso", user)

}

// UploadProfileAvatarController atualiza o avatar
func UploadProfileAvatarController(w http.ResponseWriter, r *http.Request) {

	userID, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)
	user, err := repository.GetUserByIdRepository(userID, userID)
	if err != nil {
		responses.Erro(w, http.StatusNotFound, err)
		return
	}

	if user.Avatar != "" {
		oldPath := "uploads/avatars/" + user.Avatar
		os.Remove(oldPath)
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}
	defer file.Close()

	filename := fmt.Sprintf("user_%d_%s", userID, header.Filename)
	path := "uploads/avatars/" + filename

	out, err := os.Create(path)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	err = repository.UpdateUserAvatarRepository(userID, filename)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Avatar atualizado com sucesso", map[string]string{"avatar": path})

}

// DeleteProfileAvatarController deleta o avatar
func DeleteProfileAvatarController(w http.ResponseWriter, r *http.Request) {

	userID, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.UsersRopository(db)
	user, err := repository.GetUserByIdRepository(userID, userID)
	if err != nil {
		responses.Erro(w, http.StatusNotFound, err)
		return
	}

	if user.Avatar != "" {
		os.Remove(user.Avatar)
	}

	err = repository.UpdateUserAvatarRepository(userID, "")
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Avatar removido com sucesso", nil)

}
