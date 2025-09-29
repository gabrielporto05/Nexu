package routers

import (
	"api/src/controllers"
	"net/http"
)

var profileRoutes = []Route{
	{
		URI:          "/api/profile/me",
		Method:       http.MethodGet,
		Func:         controllers.GetProfileController,
		AuthRequired: true,
	},
	{
		URI:          "/api/profile/me/avatar",
		Method:       http.MethodPatch,
		Func:         controllers.UploadProfileAvatarController,
		AuthRequired: true,
	},
	{
		URI:          "/api/profile/me/avatar",
		Method:       http.MethodDelete,
		Func:         controllers.DeleteProfileAvatarController,
		AuthRequired: true,
	},
}
