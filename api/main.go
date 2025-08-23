package main

import (
	"api/src/router"
	"fmt"
	"log"
	"net/http"
)

func main() {

	router := router.Gerar()

	fmt.Println("Running server on localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}
