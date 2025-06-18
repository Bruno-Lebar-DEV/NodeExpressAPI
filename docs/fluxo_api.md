# 🌐 Estrutura do Fluxo da API - NodeExpressAPI

## 📌 Fluxo Geral da API

1. **Requisição do Cliente** ➝ Aplicação Web ou Mobile envia uma solicitação HTTP.
2. **Middleware de Segurança** ➝ Filtros como CORS, Helmet e Rate Limiting protegem a API.
3. **Validação de Dados** ➝ Joi valida a integridade dos inputs.
4. **Autenticação e Autorização** ➝ Usuários autenticam via JWT, com roles e permissões.
5. **Processamento no Back-end** ➝ Controllers e services aplicam regras de negócio.
6. **Banco de Dados** ➝ A API consulta **MongoDB** para buscar, gravar ou atualizar informações.
7. **Proteção contra Brute Force** ➝ NodeCache limita tentativas de login.
8. **Resposta para o Cliente** ➝ A API retorna uma resposta estruturada (JSON) com status HTTP.
9. **Healthcheck** ➝ Endpoint `/api/health` monitora disponibilidade da API e do banco.

---

## 🔄 Fluxo CRUD e Autenticação

### 💾 Criar Usuário

1. `POST /api/auth/register`
2. Dados passam pela **validação** (Joi).
3. Verificação se o e-mail já existe.
4. **Criptografia de senha** (`bcrypt.js`).
5. **Gravação no Banco de Dados** (MongoDB).
6. Retorno **201 Created** + JSON do usuário.

### 📥 Autenticação (Login, Logout, Refresh)

1. `POST /api/auth/login` — Validação dos dados, verificação de credenciais, geração de JWT e refresh token.
2. `POST /api/auth/logout` — Invalida refresh token (stateless, apenas frontend remove o token).
3. `POST /api/auth/refresh` — Gera novo access token a partir de refresh token válido.
4. Expiração de sessão controlada por tempo do JWT.

### 📌 Buscar/Listar Usuários

1. `GET /api/users` — Apenas admin.
2. Middleware de **autorização** verifica token e role.
3. Filtros: paginação, busca por email, filtro por role.
4. Retorna JSON com a lista de usuários, total e paginação.

### 📌 CRUD de Tasks

- `POST /api/tasks` — Criação de task (admin/editor).
- `GET /api/tasks` — Listagem com filtros (status, grupo, busca, paginação).
- `GET /api/tasks/:id` — Visualização de task do próprio usuário.
- `PUT/PATCH /api/tasks/:id` — Atualização de task do próprio usuário.
- `DELETE /api/tasks/:id` — Remoção (soft delete) de task do próprio usuário.

---

- **Todos os fluxos são protegidos por validação de payloads, autenticação JWT e autorização por role.**
- **Logs estruturados e tratamento centralizado de erros garantem rastreabilidade e segurança.**
- **Testes automatizados cobrem todos os fluxos críticos.**

**Atualizado em:** 18/06/2025
