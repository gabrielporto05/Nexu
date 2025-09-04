package middlewares

import (
	"api/src/auth"
	"api/src/responses"
	"log"
	"net/http"
)

// Authenticate verifica se o user que está fazendo a requisição está autenticado!
func Authenticate(next http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		if err := auth.ValidateToken(r); err != nil {
			responses.Erro(w, http.StatusUnauthorized, err)

			return
		}

		next(w, r)
	}

}

// Logger excreve infos da requiseicao no terminal
func Logger(next http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("\n %s %s", r.Method, r.RequestURI)

		next(w, r)
	}

}
