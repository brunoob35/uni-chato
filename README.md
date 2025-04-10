## Projeto UniChato.space

Para rodar e testar o projeto é preciso ter Go instalado na versão mais recente.
https://go.dev/doc/install

Link do Site:
https://www.unichato.space

Host no Render (solicitar acesso):
https://render.com

Rodar com o comando:
`go run main.go`

#### Detalhamento técnico:
Chat em tempo real rodando em uma aplicação Golang com Gorilla Websocket.
Front em template HTML com CSS.

#### Sobre a estrutura do projeto:
    - Pasta Controller:
        Vai ter toda a lógica para fazer o chat funcionar, incluindo a configuração do websocket

    - Models:
        Vai armazenar nossa modelagem de dados

    - View:
        Todo o template visual assim como seus assets, configurações css e código necessário
