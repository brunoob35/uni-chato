// const ws = new WebSocket("ws://localhost:8080/ws");
const ws = new WebSocket("wss://uni-chato.onrender.com/ws");


ws.onmessage = function (event) {
    const msg = JSON.parse(event.data);
    const item = document.createElement("li");
    item.textContent = msg.username + ": " + msg.message;
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
    const username = document.getElementById("username").value;
    const message = document.getElementById("message").value;

    // Verifica se a mensagem excede 350 caracteres
    if (message.length > 350) {
        alert("A mensagem não pode exceder 350 caracteres.");
        return; // Impede o envio da mensagem
    }

    // Envia a mensagem se estiver dentro do limite
    ws.send(JSON.stringify({ username, message }));
    document.getElementById("message").value = ''; // Limpa o campo de mensagem
    updateCharCount(); // Atualiza o contador após enviar a mensagem
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