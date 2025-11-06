package controllers

import (
	"api/src/auth"
	"api/src/db"
	"api/src/models"
	"api/src/repositories"
	"api/src/responses"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/gorilla/mux"
)

// CreatePostController cria um post
func CreatePostController(w http.ResponseWriter, r *http.Request) {
	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)
		return
	}

	const maxUploadSize = 2 << 20
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	err = r.ParseMultipartForm(maxUploadSize)
	if err != nil {
		responses.Erro(w, http.StatusRequestEntityTooLarge, fmt.Errorf("arquivo muito grande. limite máximo de 2MB"))
		return
	}

	var post models.Post
	post.Description = r.FormValue("description")
	post.AuthorID = userIdToken

	if err := post.Prepare(); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	post.ID, err = repository.CreatePostRepository(post)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	// ✅ Upload da imagem (opcional)
	file, header, err := r.FormFile("image")
	if err == nil {
		defer file.Close()

		// Verifica tamanho real da imagem
		if header.Size > maxUploadSize {
			responses.Erro(w, http.StatusRequestEntityTooLarge, fmt.Errorf("A imagem excede o limite de 2MB."))
			return
		}

		filename := fmt.Sprintf("post_%d_%s", post.ID, header.Filename)
		path := "uploads/images_posts/" + filename

		out, err := os.Create(path)
		if err != nil {
			responses.Erro(w, http.StatusInternalServerError, err)
			return
		}
		defer out.Close()

		_, err = io.Copy(out, file)
		if err != nil {
			responses.Erro(w, http.StatusInternalServerError, err)
			return
		}

		if err := repository.UpdatePostImageRepository(post.ID, filename); err != nil {
			responses.Erro(w, http.StatusInternalServerError, err)
			return
		}
		post.Image = filename
	} else {
		post.Image = ""
	}

	fullPost, err := repository.GetPostByIdRepository(post.ID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusCreated, "Post criado com sucesso", fullPost)
}

// GetAllPostsController busca todos os posts dos usuarios que vc segue e os seus proprios posts
func GetAllPostsController(w http.ResponseWriter, r *http.Request) {

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	posts, err := repository.GetPostsRepository(userIdToken)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Posts encontrados com sucesso", posts)
}

// GetPostByIdController busca um post
func GetPostByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	post, err := repository.GetPostByIdRepository(postID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Post encontrado com sucesso", post)

}

func GetAllPostsUserByIdController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	userID, err := strconv.ParseUint(params["userId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	posts, err := repository.GetAllPostsByIdRepository(userID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Posts encontrados com sucesso", posts)

}

// UpdatePostByIdController atualiza um post
func UpdatePostByIdController(w http.ResponseWriter, r *http.Request) {

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	postDB, err := repository.GetPostByIdRepository(postID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	if postDB.AuthorID != userIdToken {
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para atualizar um post que não é seu"))

		return
	}

	bodyRequest, err := io.ReadAll(r.Body)
	if err != nil {
		responses.Erro(w, http.StatusUnprocessableEntity, err)

		return
	}

	var postRequest models.Post

	if err := json.Unmarshal(bodyRequest, &postRequest); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if err := postRequest.Prepare(); err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	if postRequest.Image != "" {
		oldPath := "uploads/images_posts/" + postRequest.Image
		os.Remove(oldPath)
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)
		return
	}
	defer file.Close()

	filename := fmt.Sprintf("post_%d_%s", postRequest.ID, header.Filename)
	path := "uploads/images_posts/" + filename

	out, err := os.Create(path)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	post, err := repository.UpdatePostByIdRepository(postRequest.Description, filename, postID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Post atualizado com sucesso", post)

}

// DeletePostByIdController deleta um post
func DeletePostByIdController(w http.ResponseWriter, r *http.Request) {

	userIdToken, err := auth.ExtractUserIdToken(r)
	if err != nil {
		responses.Erro(w, http.StatusUnauthorized, err)

		return
	}

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	postDB, err := repository.GetPostByIdRepository(postID)
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	if postDB.AuthorID != userIdToken {
		responses.Erro(w, http.StatusForbidden, errors.New("vc não tem permissão para deletar um post que não é seu"))

		return
	}

	if err := repository.DeletePostByIdRepository(postID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}

	responses.JSON(w, http.StatusOK, "Post deletado com sucesso", nil)

}

// LikePostController da like em um post
func LikePostController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	userID, _ := auth.ExtractUserIdToken(r)
	alreadyLiked, err := repository.HasUserLikedPost(postID, userID)
	if alreadyLiked {
		responses.Erro(w, http.StatusConflict, errors.New("você já curtiu esse post"))
		return
	}
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	if err = repository.CreateLike(postID, userID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Post curtido com sucesso", nil)

}

// UnlikePostController da unlike em um post
func UnlikePostController(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	postID, err := strconv.ParseUint(params["postId"], 10, 64)
	if err != nil {
		responses.Erro(w, http.StatusBadRequest, err)

		return
	}

	db, err := db.ConnectionDB()
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)

		return
	}
	defer db.Close()

	repository := repositories.PostsRopository(db)

	userID, _ := auth.ExtractUserIdToken(r)
	alreadyLiked, err := repository.HasUserLikedPost(postID, userID)
	if !alreadyLiked {
		responses.Erro(w, http.StatusNotFound, errors.New("você ainda não curtiu esse post"))
		return
	}
	if err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	if err = repository.DeleteLike(postID, userID); err != nil {
		responses.Erro(w, http.StatusInternalServerError, err)
		return
	}

	responses.JSON(w, http.StatusOK, "Post descurtido com sucesso", nil)

}
