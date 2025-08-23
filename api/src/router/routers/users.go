package routers

import (
	"api/src/controllers"
	"net/http"
)

var userRoutes = []Route{
	{
		URI:          "/api/users",
		Method:       http.MethodPost,
		Func:         controllers.CreateUserController,
		AuthRequired: false,
	},
	{
		URI:          "/api/users",
		Method:       http.MethodGet,
		Func:         controllers.GetUsersController,
		AuthRequired: false,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodGet,
		Func:         controllers.GetUsersByIdController,
		AuthRequired: false,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodPut,
		Func:         controllers.UpdateUserByIdController,
		AuthRequired: false,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodDelete,
		Func:         controllers.DeleteUserByIdController,
		AuthRequired: false,
	},
}
