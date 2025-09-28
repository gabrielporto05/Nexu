package routers

import (
	"api/src/controllers"
	"net/http"
)

var userRoutes = []Route{
	{
		URI:          "/api/users",
		Method:       http.MethodGet,
		Func:         controllers.GetUsersByNameOrNickController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodGet,
		Func:         controllers.GetUsersByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodPut,
		Func:         controllers.UpdateUserByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}/update-password",
		Method:       http.MethodPatch,
		Func:         controllers.UpdateUserPasswordByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}",
		Method:       http.MethodDelete,
		Func:         controllers.DeleteUserByIdController,
		AuthRequired: true,
	},
}
