# Instruções para Rodar o Projeto

## 1. Subir o Banco com Docker

```bash
docker-compose up -d

```

2. Executar as Migrations

```bash
npx knex migrate:latest
```

3. Rodar as Seeds

```bash
npx knex seed:run
```

4. Rodar o Servidor

```bash
npm start
```

O servidor rodará em:

http://localhost:3000
