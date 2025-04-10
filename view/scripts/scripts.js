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
    const timestamp = formatTimestamp(msg.timestamp);
    item.innerHTML = `<span class="timestamp">${formatTimestamp(msg.timestamp)}</span> - <strong>${msg.username}:</strong><br>${msg.message}`;

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

// Formata a data/hora que aparece nas mensagens
function formatTimestamp(ts) {
    const date = new Date(ts);
    const pad = (n) => n.toString().padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${hours}:${minutes}`;
}

// Envio das mensagens junto da contagem de caracteres
document.getElementById("form").onsubmit = function (event) {
    event.preventDefault();
    const message = document.getElementById("message").value;

    if (message.length > 350) {
        alert("A mensagem não pode exceder 350 caracteres.");
        return;
    }

    const timestamp = Date.now(); // Aqui garante que será o exato momento do envio

    ws.send(JSON.stringify({ username, message, timestamp }));

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