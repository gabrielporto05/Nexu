package controllers

import (
	"api/src/responses"
	"net/http"
)

// CreatePostController cria um post
func CreatePostController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusCreated, "Post criado com sucesso", nil)

}

// GetAllPostsController busca todos os posts
func GetAllPostsController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Posts encontrados com sucesso", nil)
}

// GetPostByIdController busca um post
func GetPostByIdController(w http.ResponseWriter, r *http.Request) {

	responses.JSON(w, http.StatusOK, "Post encontrado com sucesso", nil)

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
