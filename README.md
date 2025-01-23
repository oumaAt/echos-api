## Technologies

- NestJS avec typeORM
- MySQL

## .ENV

NODE_ENV=dev
PORT=3000
DATABASE_NAME=echos_dev
DATABASE_PORT=3306
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
SECRET=secret
REDIS_HOST=localhost
REDIS_PORT=6379

## Project setup

```bash
$ npm install
```

## Redis configuration

J'utilise Windows donc j'ai du exécuter ces commandes sur PowerShell ( en tant que Admin)
wsl --install
sudo apt update
sudo apt install redis-server
sudo service redis-server start
redis-cli

## Run migrations

```bash
$ npm run migration:run
```

## Revert migrations

```bash
$ npm run migration:revert
```


## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## API Documentation

La documentation complète de l'API est disponible via Swagger. Vous pouvez y accéder en utilisant l'URL suivante :
http://localhost:3000/api-docs
