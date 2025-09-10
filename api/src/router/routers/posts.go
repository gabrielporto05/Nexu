package routers

import (
	"api/src/controllers"
	"net/http"
)

var postRoutes = []Route{
	{
		URI:          "/api/posts",
		Method:       http.MethodPost,
		Func:         controllers.CreatePostController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts",
		Method:       http.MethodGet,
		Func:         controllers.GetAllPostsController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts/{postId}",
		Method:       http.MethodGet,
		Func:         controllers.GetPostByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts/{postId}",
		Method:       http.MethodPut,
		Func:         controllers.UpdatePostByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts/{postId}",
		Method:       http.MethodDelete,
		Func:         controllers.DeletePostByIdController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts/{postId}/like",
		Method:       http.MethodPost,
		Func:         controllers.LikePostController,
		AuthRequired: true,
	},
	{
		URI:          "/api/posts/{postId}/unlike",
		Method:       http.MethodPost,
		Func:         controllers.UnlikePostController,
		AuthRequired: true,
	},
}
