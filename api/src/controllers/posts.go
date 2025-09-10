package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// CreatePostController cria um post
func CreatePostController(w http.ResponseWriter, r *http.Request) {

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)

		return
	}

	var post models.Post

	post.AuthorID = userIdToken

	if err := json.Unmarshal(bodyRequest, &post); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if err := post.Prepare(); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	post.ID, err = repository.CreatePostRepository(post)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusCreated, "Post criado com sucesso", post)

}

// GetAllPostsController busca todos os posts
func GetAllPostsController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Posts encontrados com sucesso", nil)
}

// GetPostByIdController busca um post
func GetPostByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
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

	repository := repositories.PostsRopository(db)

	post, err := repository.GetPostByIdRepository(postID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Post encontrado com sucesso", post)

}

// UpdatePostByIdController atualiza um post
func UpdatePostByIdController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Post atualizado com sucesso", nil)

}

// DeletePostByIdController deleta um post
func DeletePostByIdController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Post deletado com sucesso", nil)

}

// LikePostController da like em um post
func LikePostController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Post curtido com sucesso", nil)

}

// UnlikePostController da unlike em um post
func UnlikePostController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Post descurtido com sucesso", nil)

}
