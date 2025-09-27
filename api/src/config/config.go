package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	// URLConnectionDB é a url de conexão com o banco
	URLConnectionDB = ""

	// Port é a porta onde a api vai rodar
	Port = 0

	SecretKey []byte

	MyEmail         = ""
	MyEmailPassowrd = ""
)

// Loading vai inicialzar as variaveis de ambiente
func Loading() {

	var err error

	if err = godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	Port, err = strconv.Atoi(os.Getenv("API_PORT"))
	if err != nil {
		Port = 5000
	}

	URLConnectionDB = fmt.Sprintf("%s:%s@/%s?charset=utf8&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	SecretKey = []byte(os.Getenv("SECRET_KEY"))

	MyEmail = os.Getenv("MY_EMAIL")
	MyEmailPassowrd = os.Getenv("MY_EMAIL_PASSWORD")

}
