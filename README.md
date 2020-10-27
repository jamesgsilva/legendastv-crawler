# Legendas TV Crawler

Busca informações de legendas no site [legendas.tv](http://legendas.tv).

![exemplo](https://i.imgur.com/dTKXWaH.png)

Veja mais [asciinema](https://asciinema.org/a/3AiIV6pRWmoPGShbswbHiAaAu).

## Installation

Defina ou copie as variáveis de ambiente.

```sh
cp .env.example .env
```

Instale as dependências do projeto.

```sh
npm install
```

## Como usar

Buscar legenda, use a opção `-t` para informar o termo da busca.

```sh
node -r dotenv/config index.js search -t "Waiting for the Barbarians"
```

Autenticar usuário, as credenciais devem ser definidas nas variáveis de ambiente.

```sh
node -r dotenv/config index.js login
```

## Testes

Para rodar os use o comando do npm.

```sh
npm test
```