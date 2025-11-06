package main

import (
	"api/src/config"
	"api/src/router"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

func main() {
	config.Loading()

	mux := http.NewServeMux()

	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	mux.Handle("/", router.Generate())

	environment := os.Getenv("ENVIRONMENT")
	if environment == "" {
		environment = "development"
	}

	var allowedOrigins []string

	if environment == "production" {
		allowedOrigins = []string{
			"https://nexu.gabrielporto.me",
			"https://*.gabrielporto.me",
			"exp://*",
		}
	} else {
		allowedOrigins = []string{
			"http://localhost:8081",
			"http://192.168.15.11:8081",
			"http://192.168.6.121:8081",
			"exp://*",
		}
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type", "Accept"},
		AllowCredentials: true,
		Debug:            environment != "production",
	})

	handler := c.Handler(mux)

	fmt.Printf("Running server on http://192.168.15.11:%d\n", config.Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.Port), handler))

}
