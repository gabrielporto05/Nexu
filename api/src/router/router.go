package router

import "github.com/gorilla/mux"

// Gerar vai retornar um router com todas as rotas da API
func Gerar() *mux.Router {

	return mux.NewRouter()

}
