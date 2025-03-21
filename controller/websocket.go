package controller

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"uni-chat/models"
)

var broadcast = make(chan models.Message)
var clients = make(map[*websocket.Conn]bool)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		allowedOrigins := map[string]bool{
			"https://uni-chato.onrender.com": true,
			"https://www.unichato.space":     true,
		}
		return allowedOrigins[r.Header.Get("Origin")]
	},
}

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	defer ws.Close()
	clients[ws] = true

	for {
		var msg models.Message
		if err := ws.ReadJSON(&msg); err != nil {
			delete(clients, ws)
			break
		}

		broadcast <- msg
	}
}

func HandleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			if err := client.WriteJSON(msg); err != nil {
				delete(clients, client)
				client.Close()
			}
		}
	}
}
