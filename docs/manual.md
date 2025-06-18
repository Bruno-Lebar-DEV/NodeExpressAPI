# 🧩 Manual de Montagem: NodeExpressAPI do Zero

Este guia serve como um checklist prático e sequencial para construir uma API Node.js/Express robusta, segura e testada, igual ao projeto NodeExpressAPI. Siga cada etapa como se estivesse montando uma casa de LEGO, peça por peça!

---

## 1️⃣ Estrutura Inicial e Configuração
- [ ] Criar repositório e inicializar projeto Node.js (`npm init`)
- [ ] Instalar dependências principais: `express`, `mongoose`, `dotenv`, `joi`, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, `winston`, `node-cache`
- [ ] Estruturar pastas: `src/controllers`, `src/models`, `src/routes`, `src/middlewares`, `src/services`, `src/config`, `src/tests`, `docs`
- [ ] Configurar ESLint e scripts de lint no `package.json`
- [ ] Configurar variáveis de ambiente com `.env`

## 2️⃣ Banco de Dados e Modelos
- [ ] Implementar conexão MongoDB (`mongoose`)
- [ ] Criar modelo `User` com roles, soft delete, timestamps
- [ ] Criar modelo `Task` com owner, status, soft delete, timestamps

## 3️⃣ Middlewares Globais
- [ ] Adicionar `helmet` para headers de segurança
- [ ] Adicionar CORS dinâmico
- [ ] Adicionar rate limiting global
- [ ] Adicionar parser JSON (`express.json()`)
- [ ] Implementar logger estruturado (`winston`)

## 4️⃣ Autenticação e Autorização
- [ ] Implementar registro de usuário (`/api/auth/register`)
- [ ] Implementar login com JWT (`/api/auth/login`)
- [ ] Implementar refresh token (`/api/auth/refresh`)
- [ ] Implementar logout (`/api/auth/logout`)
- [ ] Middleware para verificar JWT e roles
- [ ] Middleware para brute force login (NodeCache)

## 5️⃣ CRUD de Usuários
- [ ] Implementar rotas protegidas para CRUD de usuários (`/api/users`)
- [ ] Permitir atualização parcial (PATCH) e total (PUT)
- [ ] Implementar soft delete
- [ ] Filtros: paginação, busca por email, filtro por role
- [ ] Proteger rotas por role (admin, visual, etc)

## 6️⃣ CRUD de Tasks
- [ ] Implementar rotas protegidas para CRUD de tasks (`/api/tasks`)
- [ ] Permitir atualização parcial e total
- [ ] Soft delete de tasks
- [ ] Filtros: paginação, status, grupo, busca por termo
- [ ] Proteger tasks por owner

## 7️⃣ Healthcheck e Infra
- [ ] Implementar endpoint `/api/health` para status da API e banco
- [ ] Centralizar tratamento de erros
- [ ] Silenciar logs em ambiente de teste

## 8️⃣ Testes Automatizados
- [ ] Configurar Jest e supertest para testes automatizados
- [ ] Criar testes para autenticação, usuários, tasks, segurança, erros e validações
- [ ] Cobrir cenários de brute force, rate limit, privilege escalation, XSS, headers, etc
- [ ] Garantir cobertura de sucesso e erro para todos os fluxos

## 9️⃣ Documentação
- [ ] Documentar API com Swagger/OpenAPI
- [ ] Manter documentação de requisitos, cobertura de testes e fluxo da API

## 🔟 CI/CD e Qualidade
- [ ] Configurar pipeline CI/CD (GitHub Actions) para rodar lint e testes a cada push/PR
- [ ] Garantir que todos os testes e lint passem antes de deploy

---

> **Dica:** Use este checklist como referência para novos projetos Node.js/Express seguros, escaláveis e testáveis!

**Atualizado em:** 18/06/2025
