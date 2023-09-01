# Sinavez backend

Aqui está o codigo para o backend do sinavez v2.0

É recomendado essas versões ou mais novas
- Node.js >= v18.14.0
- Npm >= 9

## Setup
Para instalar todas as dependencias, só é necessario executar o npm.
```bash
npm install
```
Você precisara criar um arquivo `.env` na pasta do repositório, com esses valores presentes:
```env
# será utilizado por `npm run dev`
DB_URL_DEV=...
# será utilizado por `npm run start`
DB_URL_PROD=...

PORT=...
JWT_SECRET=...

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...
AWS_BUCKET_URL=...
```
***Os urls devem ser URIs de conexão para banco de dados MongoDB.***

Feito isso, você poderá rodar o comando `npm run dev` para rodar o servidor em modo dev, usando o banco de dados DEV.

## Setup Docker

Não é necessario usar o docker para rodar o servidor, porem:

> `sudo apt-get update`

> `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

> `sudo apt-key fingerprint 0EBFCD88`

> `sudo apt-get install docker docker.io`

> `sudo curl -L "https://github.com/docker/compose/releases/download/1.28.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

> `sudo chmod +x /usr/local/bin/docker-compose`

> `sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`

# Generating Images

## path : root

> `sudo docker-compose up`

## Documentação

* [Documentação no PostMan](https://documenter.getpostman.com/view/24170273/2s935sn2Dn)


