package responses

import (
	"encoding/json"
	"log"
	"net/http"
)

// JSON retorna uma resposta JSON com mensagem e dados
func JSON(w http.ResponseWriter, statusCode int, message string, data interface{}) {

	w.WriteHeader(statusCode)

	response := struct {
		Message string      `json:"message"`
		Data    interface{} `json:"data"`
	}{
		Message: message,
		Data:    data,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Fatal(err)
	}

}

// Erro retorna um erro em formato JSON com mensagem e detalhes
func Erro(w http.ResponseWriter, statusCode int, err error) {

	JSON(w, statusCode, "Erro ao processar requisição", struct {
		Error string `json:"error"`
	}{
		Error: err.Error(),
	})

}
