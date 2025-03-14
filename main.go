package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"uni-chat/controller"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	fs := http.FileServer(http.Dir("./view"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", controller.HandleConnections)

	go controller.HandleMessages()

	fmt.Println("Listening on port " + os.Getenv("PORT"))
	if err := http.ListenAndServe(":"+os.Getenv("PORT"), nil); err != nil {
		panic(err)
	}
}
