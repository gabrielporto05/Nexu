package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/repositories"
	"api/src/responses"
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// FollowUser segue um user
func FollowUser(w http.ResponseWriter, r *http.Request) {

	followID, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if followID == userID {
		responses.Erro(w, http.StatusForbidden, errors.New("não é possível vc seguir vc mesmo"))

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.FollowersUsersRopository(db)

	if err := repository.FollowUserRopository(userID, followID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Follow concluido com sucess!", nil)

}

// UnfollowUser deixa de seguir um user
func UnfollowUser(w http.ResponseWriter, r *http.Request) {
	followerID, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)
		return
	}

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}

	if followerID == userID {
		responses.Erro(w, http.StatusForbidden, errors.New("não é possível deixar de seguir a si mesmo"))
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.FollowersUsersRopository(db)

	if err := repository.UnfollowUserRepository(userID, followerID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Unfollow concluído com sucesso", nil)
}

// GetUserConnectionsController busca as conexões de um user
func GetUserConnectionsController(w http.ResponseWriter, r *http.Request) {

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if userIdToken != userID {
		responses.Erro(w, http.StatusForbidden, errors.New("não é possível ver as conexões de outro usuario"))

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.FollowersUsersRopository(db)

	connections, err := repository.ConnectionsUserRepository(userIdToken)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Conexões listadas com sucesso", connections)
}

// GetFollowersController busca os seguidores de um user
func GetFollowersController(w http.ResponseWriter, r *http.Request) {

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

	repository := repositories.FollowersUsersRopository(db)

	users, err := repository.FollowersUserRepository(userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Followers listado com sucesso", users)
}

// GetFollowingController busca os users que um user segue
func GetFollowingController(w http.ResponseWriter, r *http.Request) {

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

	repository := repositories.FollowersUsersRopository(db)

	users, err := repository.FollowingUserRepository(userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Following listado com sucesso", users)
}
