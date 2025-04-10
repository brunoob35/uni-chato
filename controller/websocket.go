package controller

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"uni-chat/models"
)

var broadcast = make(chan models.Message)
var clients = make(map[*websocket.Conn]bool)
var history = []models.Message{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		allowedOrigins := map[string]bool{
			"https://uni-chato.onrender.com": true,
			"https://www.unichato.space":     true,
			"http://localhost:8080":          true,
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

	// Envia o histórico de mensagens assim que o cliente se conecta
	for _, msg := range history {
		ws.WriteJSON(msg)
	}

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
		addToHistory(msg) // Salva no histórico

		for client := range clients {
			if err := client.WriteJSON(msg); err != nil {
				client.Close()
				delete(clients, client)
			}
		}
	}
}

// Adiciona mensagem ao histórico mantendo limite de 100
func addToHistory(msg models.Message) {
	history = append(history, msg)
	if len(history) > 100 {
		history = history[1:] // remove a mais antiga
	}
}
