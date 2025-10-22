# Mobile Escola 

## Tecnologias
- Node.js
- MySQL (XAMPP)
- Prisma
- React.js
- Vite

## Executar o projeto localmente

- Clone o repositório
- Configure o banco de dados MySQL
- Adicione o arquivo `.env` na raiz do projeto com a seguinte configuração:
```bash
DATABASE_URL="mysql://root@localhost:3306/escola"
```
- Certifique-se de que o MySQL está em execução (usando XAMPP)
- acesse a pasta do front end `./web` instale as dependências e inicie o servidor de desenvolvimento
```bash
cd web
npm install
npm run dev
```
Clicar no link localhost para executar http://localhost:5173/

- Agora na area de trabalho quando abrir a pasta escola flutter api no explorer entre na api e abra com git bash e execute
```bash
npm install
npx prisma migrate dev --name init
npx nodemon
```

## Der
![der](./docs/der.png)
## Uml
![der](./docs/uml.png)
## Banco de dados
![der](./docs/bd.png)
