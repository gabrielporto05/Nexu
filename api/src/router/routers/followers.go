package routers

import (
	"api/src/controllers"
	"net/http"
)

var followersRoutes = []Route{
	{
		URI:          "/api/users/{userId}/follow",
		Method:       http.MethodPost,
		Func:         controllers.FollowUser,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}/unfollow",
		Method:       http.MethodDelete,
		Func:         controllers.UnfollowUser,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}/connections",
		Method:       http.MethodGet,
		Func:         controllers.GetUserConnectionsController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}/followers",
		Method:       http.MethodGet,
		Func:         controllers.GetFollowersController,
		AuthRequired: true,
	},
	{
		URI:          "/api/users/{userId}/following",
		Method:       http.MethodGet,
		Func:         controllers.GetFollowingController,
		AuthRequired: true,
	},
}
