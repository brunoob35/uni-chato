let username = "";

while (!username || username.trim() === "") {
    username = prompt("Qual seu nome?");
}

const ws = new WebSocket(
    location.hostname === "localhost"
        ? "ws://localhost:8080/ws"
        : "wss://uni-chato.onrender.com/ws"
);


ws.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    const item = document.createElement("li");
    item.textContent = msg.username + ": " + msg.message;

    if (msg.username === username) {
        item.classList.add("me");
    }
    const messages = document.getElementById("messages");

    // Adiciona a nova mensagem ao topo da lista
    messages.appendChild(item);

    // Verifica se o número de mensagens excede 100
    if (messages.children.length > 100) {
        // Remove a mensagem mais antiga (o primeiro item da lista)
        messages.removeChild(messages.firstChild);
    }

    // Rola para o final automaticamente sempre que uma nova mensagem chega
    messages.scrollTop = messages.scrollHeight;
};

document.getElementById("form").onsubmit = function (event) {
    event.preventDefault();
    const message = document.getElementById("message").value;

    if (message.length > 350) {
        alert("A mensagem não pode exceder 350 caracteres.");
        return;
    }

    ws.send(JSON.stringify({ username, message }));
    document.getElementById("message").value = '';
    updateCharCount();
};


// Atualiza o contador de caracteres
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");

messageInput.addEventListener("input", function () {
    updateCharCount();
});

function updateCharCount() {
    const messageLength = messageInput.value.length;
    charCount.textContent = `${messageLength}/350`; // Exibe o contador
}