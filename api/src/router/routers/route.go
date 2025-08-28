package routers

import (
	"net/http"

	"github.com/gorilla/mux"
)

// Rota representa uma rota da API
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

	for _, route := range routers {
		r.HandleFunc(route.URI, route.Func).Methods(route.Method)
	}

	return r

}
