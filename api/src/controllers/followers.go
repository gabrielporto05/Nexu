package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/repositorys"
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

	repository := repositorys.FollowersUsersRopository(db)

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

	repository := repositorys.FollowersUsersRopository(db)

	if err := repository.UnfollowUserRepository(userID, followerID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Unfollow concluído com sucesso", nil)
}
