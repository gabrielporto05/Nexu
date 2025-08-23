package controllers

import "net/http"

// CreateUserController cria um usuário
func CreateUserController(w http.ResponseWriter, r *http.Request) {

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("CreateUserController!"))

}

// GetUsersController busca todos os usuários
func GetUsersController(w http.ResponseWriter, r *http.Request) {

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GetUsersController!"))

}

// GetUsersByIdController busca um usuário
func GetUsersByIdController(w http.ResponseWriter, r *http.Request) {

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("GetUsersByIdController!"))

}

// UpdateUserByIdController atualiza um usuário
func UpdateUserByIdController(w http.ResponseWriter, r *http.Request) {

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("UpdateUserByIdController!"))

}

// DeleteUserByIdController deleta um usuário
func DeleteUserByIdController(w http.ResponseWriter, r *http.Request) {

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("DeleteUserByIdController!"))

}
