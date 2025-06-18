# NodeExpressAPI 🌐

## 📌 Visão Geral

O **NodeExpressAPI** é uma API REST robusta, desenvolvida em **Node.js** com **Express** e **MongoDB**, ideal para gerenciamento de usuários e tarefas. O projeto enfatiza segurança, escalabilidade, documentação e testes automatizados, garantindo integração eficiente com aplicações web e móveis.

---

## 🔥 Principais Funcionalidades

✔️ **CRUD completo** para usuários e tasks, com filtros avançados, paginação e soft delete.  
✔️ **Autenticação segura** via JWT, refresh token, logout e expiração de sessão.  
✔️ **Controle de acesso por roles** (admin, editor, visual) e autorização granular.  
✔️ **Validação de dados** com Joi (mensagens em português).  
✔️ **Segurança:** Helmet, CORS dinâmico, rate limiting, brute force (NodeCache), validação de payloads, headers seguros.  
✔️ **Healthcheck:** endpoint `/api/health` para monitoramento da API e banco.  
✔️ **Testes automatizados:** cobertura total de cenários de sucesso, erro e segurança (Jest + supertest).  
✔️ **Documentação Swagger/OpenAPI** sempre atualizada.  
✔️ **Pipeline CI/CD:** lint e testes automatizados a cada push/pull request (GitHub Actions).

---

## 🚀 Tecnologias Utilizadas

- **Node.js + Express**
- **MongoDB**
- **JWT** (autenticação stateless)
- **Joi** (validação de dados)
- **Winston** (logging estruturado)
- **Jest + supertest** (testes automatizados)
- **Swagger/OpenAPI** (documentação)
- **GitHub Actions** (CI/CD)

---

## 📂 Estrutura do Repositório

```bash
📦 NodeExpressAPI
 ├── 📂 src/            # Código principal da API
 │   ├── controllers/   # Lógica dos endpoints
 │   ├── models/        # Modelos de dados
 │   ├── routes/        # Definição das rotas
 │   ├── middlewares/   # Segurança e validações
 │   ├── services/      # Lógica de negócios
 │   ├── tests/         # Testes automatizados
 │   ├── config/        # Configurações e variáveis de ambiente
 │   ├── index.js       # Arquivo principal
 │   ├── server.js      # Configuração do servidor
 ├── 📂 docs/           # Documentação do projeto
 ├── 📜 README.md       # Documento de apresentação do projeto
 ├── 📜 LICENSE         # Licença de código aberto
 ├── 📜 .gitignore      # Arquivos que devem ser ignorados no repositório
```

---

## 🔧 Como Rodar o Projeto

### **Pré-requisitos**

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

### **1️⃣ Clonar o Repositório**

```bash
git clone https://github.com/seu-usuario/NodeExpressAPI.git
cd NodeExpressAPI
```

### **2️⃣ Instalar Dependências**

```bash
npm install
```

### **3️⃣ Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto e configure suas credenciais:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/nodeexpress
JWT_SECRET=sua-chave-secreta
```

### **4️⃣ Executar a API**

```bash
npm run dev
```

Acesse a documentação Swagger em: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## ✅ Requisitos e Cobertura

- Todos os requisitos funcionais e não funcionais atendidos ([veja detalhes](docs/requisitos.md)).
- Cobertura de testes automatizados ([veja cobertura](docs/testes-cobertura.md)).
- Documentação Swagger sempre atualizada.
- Pipeline CI/CD para qualidade contínua.

---

## 🚀 Contribuições

Contribuições são bem-vindas! Siga as instruções do repositório para abrir issues ou pull requests.

---

## 📄 Licença

Este projeto está sob a licença MIT.
