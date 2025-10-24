package main

import (
	"api/src/config"
	"api/src/router"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	config.Loading()

	mux := http.NewServeMux()

	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	mux.Handle("/", router.Generate())

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:8081", "http://192.168.15.1:8081"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	fmt.Printf("Running server on http://localhost:%d\n", config.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.Port), handler))
}
