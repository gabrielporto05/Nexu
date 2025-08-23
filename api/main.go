package main

import (
	"api/src/router"
	"fmt"
	"log"
	"net/http"
)

func main() {

	router := router.Generate()

	fmt.Println("Running server on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}
