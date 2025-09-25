package routers

import (
	"api/src/controllers"
	"net/http"
)

var authRoutes = []Route{
	{
		URI:          "/api/auth/profile",
		Method:       http.MethodGet,
		Func:         controllers.GetProfileController,
		AuthRequired: true,
	},
	{
		URI:          "/api/auth/login",
		Method:       http.MethodPost,
		Func:         controllers.AuthLoginController,
		AuthRequired: false,
	},
	{
		URI:          "/api/auth/register",
		Method:       http.MethodPost,
		Func:         controllers.CreateUserController,
		AuthRequired: false,
	},
}
