package routers

import (
	"api/src/middlewares"
	"net/http"

	"github.com/gorilla/mux"
)

// Route representa uma rota da API
type Route struct {
	URI          string
	Method       string
	Func         func(http.ResponseWriter, *http.Request)
	AuthRequired bool
}

// Config configura todas as rotas no Router
func Config(r *mux.Router) *mux.Router {

	routers := userRoutes
	routers = append(routers, authRoutes...)
	routers = append(routers, followersRoutes...)

	for _, route := range routers {

		if route.AuthRequired {
			r.HandleFunc(
				route.URI,
				middlewares.Logger(middlewares.Authenticate(route.Func)),
			).Methods(route.Method)

			continue
		}

		r.HandleFunc(route.URI, middlewares.Logger(route.Func)).Methods(route.Method)
	}

	return r

}
