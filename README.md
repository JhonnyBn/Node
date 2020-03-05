# JSON Web Tokens - Testing with Node

**Criando o server:**

- Certifique-se de instalar o Node.Js - https://nodejs.org/en/download/
- Abra um terminal e clone o repositório - git clone https://github.com/JhonnyBn/Node.git
- Instalar as dependências:
    - `npm install`
- Iniciar o server:
    - `npm start`
- Siga a próxima seção para testar

**Testando:**
- Abra o Postman
- Tente realizar GET em `localhost:3000/`
    - A seguinte mensagem de erro aparecerá: `{"auth":false,"message":"Failed to authenticate token."}`
- Agora, realize login com POST em `localhost:3000/login`
    - No body, coloque o JSON:
    ```
    {
        "user": "admin",
        "pwd": "admin"
    }
    ```
    - Você receberá como resposta algo como: `{"auth":true,"token":"XXX"}`
    - Copie esse token para uma variável no header `access-token`
- Tente realizar GET novamente, com parâmetros de teste: `localhost:3000/?um=1&dois=2&tres=3&quatro=4`