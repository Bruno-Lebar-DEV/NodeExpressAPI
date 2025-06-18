# Manual de Montagem: API Node.js/Express Completa (Passo a Passo)

Este manual é um guia prático para construir, do zero, uma API robusta como a deste projeto. Siga cada etapa como se estivesse montando uma casa de LEGO, peça por peça. Use o checklist para marcar o progresso e adaptar para projetos futuros.

---

## 🧱 1. Inicialização do Projeto
- [ ] Criar pasta do projeto e inicializar com `npm init -y`
- [ ] Configurar `.gitignore`, `.env`, `.env.example`
- [ ] Instalar dependências principais:
  - express, dotenv, cors, mongoose, jsonwebtoken, bcrypt, joi, winston, express-rate-limit, node-cache
- [ ] Instalar dependências de desenvolvimento:
  - nodemon, eslint, jest, supertest, cross-env

## 🧱 2. Estrutura de Pastas Modular
- [ ] Criar estrutura:
  - `src/` com subpastas: controllers, models, routes, middlewares, services, config, docs
  - `tests/` para testes automatizados
  - `docs/` para documentação

## 🧱 3. Configuração Inicial
- [ ] Configurar servidor Express (`index.js`/`server.js`)
- [ ] Configurar conexão com banco (ex: MongoDB via Mongoose)
- [ ] Configurar variáveis de ambiente
- [ ] Configurar logger estruturado (Winston)
- [ ] Configurar CORS dinâmico

## 🧱 4. Modelos e Validações
- [ ] Criar modelos (User, Task) com Mongoose
- [ ] Implementar validações com Joi (mensagens padronizadas)
- [ ] Implementar timestamps e soft delete

## 🧱 5. Autenticação e Autorização
- [ ] Implementar registro e login com JWT
- [ ] Implementar roles (admin, user, etc.)
- [ ] Middleware de autorização por role
- [ ] Middleware de verificação de token
- [ ] Políticas de senha forte

## 🧱 6. Middlewares de Segurança
- [ ] Rate limit global (express-rate-limit)
- [ ] Proteção contra brute force (NodeCache)
- [ ] Validação de payloads e headers
- [ ] Rejeição de cookies inválidos

## 🧱 7. CRUD e Funcionalidades
- [ ] CRUD de usuários (GET, POST, PATCH, DELETE)
- [ ] CRUD de tasks (GET, POST, PATCH, DELETE)
- [ ] Filtros avançados (status, busca por termo)
- [ ] Paginação e ordenação
- [ ] Soft delete e timestamps

## 🧱 8. Endpoints de Sessão e Healthcheck
- [ ] Logout, refresh token, expiração de sessão
- [ ] Endpoint `/api/health` (healthcheck)

## 🧱 9. Testes Automatizados
- [ ] Configurar Jest + Supertest
- [ ] Setup/teardown global para testes
- [ ] Testes de autenticação, usuários, tasks, erros, segurança
- [ ] Testes de integração (falha de banco, isolamento, performance)
- [ ] Scripts npm para rodar todos os testes

## 🧱 10. Documentação e Swagger
- [ ] Documentar endpoints no Swagger
- [ ] Documentar requisitos, cobertura de testes, fluxo da API
- [ ] Checklist visual de requisitos e testes (✔️, 🟡, ❌)

## 🧱 11. Pipeline CI/CD e Qualidade
- [ ] Configurar pipeline (ex: GitHub Actions) para lint e testes
- [ ] Garantir 100% dos requisitos e cobertura de testes
- [ ] Corrigir todos os warnings/lints

## 🧱 12. Manutenção e Boas Práticas
- [ ] Atualizar documentação a cada feature
- [ ] Manter logs limpos em produção/teste
- [ ] Revisar segurança e performance periodicamente

---

## Checklist Resumido

- [ ] Inicialização e dependências
- [ ] Estrutura modular
- [ ] Configuração de ambiente
- [ ] Modelos e validações
- [ ] Autenticação e roles
- [ ] Middlewares de segurança
- [ ] CRUD e filtros
- [ ] Endpoints de sessão/health
- [ ] Testes automatizados
- [ ] Documentação/Swagger
- [ ] Pipeline CI/CD
- [ ] Manutenção e boas práticas

---

> Consulte os arquivos `docs/requisitos.md`, `docs/testes-cobertura.md` e `docs/manual_montagem.md` para detalhes de cada etapa, exemplos de código e dicas de implementação.

---

**Dica:** Use este manual como referência para novos projetos, adaptando cada etapa conforme a necessidade do contexto!
