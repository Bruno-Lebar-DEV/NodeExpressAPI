# Cobertura de Testes Automatizados

## Auth - Login
- ✔️ Login com sucesso
- ✔️ Login com senha errada
- ✔️ Login com email inexistente
- ✔️ Login com payload inválido/campos ausentes
- ✔️ Login com conta removida/desativada

## Auth - Register
- ✔️ Registro com sucesso
- ✔️ Registro de usuário já existente
- ✔️ Registro com campos obrigatórios ausentes
- ✔️ Registro com senha fraca
- ✔️ Registro com email inválido

## Auth - Protected Routes
- ✔️ Negar acesso sem token
- ✔️ Negar acesso com token inválido
- ✔️ Permitir acesso com token válido

## Auth - Role Validation
- ✔️ Permitir acesso à listagem de usuários para admin
- ✔️ Negar acesso à listagem de usuários para visual
- ✔️ Negar acesso para outros papéis não autorizados

## Auth - Sessão
- ✔️ Logout e invalidação de token
- ✔️ Renovação de token via refresh token
- ✔️ Expiração de sessão em tempo real

## Usuários - Criação
- ✔️ Criação de usuário com sucesso
- ✔️ Criação de usuário com campos inválidos
- ✔️ Criação de usuário com e-mail duplicado
- ✔️ Criação de usuário com senha fraca

## Usuários - Listagem
- ✔️ Listagem de usuários com sucesso
- ✔️ Paginação de usuários
- ✔️ Filtro por role
- ✔️ Busca por email
- ✔️ Listagem com parâmetros inválidos
- ✔️ Listagem sem autorização

## Usuários - Atualização
- ✔️ Atualização de usuário com sucesso
- ✔️ Atualização com campos inválidos
- ✔️ Atualização de role/email por não-admin

## Usuários - Visualização
- ✔️ Visualização de usuário por id com sucesso
- ✔️ Visualização de usuário inexistente
- ✔️ Visualização sem autorização

## Usuários - Remoção
- ✔️ Remoção (soft delete) de usuário com sucesso
- ✔️ Remoção de usuário inexistente
- ✔️ Remoção sem autorização

## Tasks - Criação
- ✔️ Criação de task com sucesso
- ✔️ Erro ao criar task sem título
- ✔️ Criação de task com campos obrigatórios ausentes
- ✔️ Criação de task sem autorização

## Tasks - Listagem
- ✔️ Listagem de tasks com sucesso
- ✔️ Erro ao listar tasks com página inválida
- ✔️ Filtros avançados (status, data, prioridade)
- ✔️ Busca por termo no título/descrição
- ✔️ Listagem sem autorização

## Tasks - Atualização
- ✔️ Atualização de task com sucesso
- ✔️ Erro ao atualizar task inexistente
- ✔️ Atualização com campos inválidos
- ✔️ Atualização sem autorização

## Tasks - Visualização
- ✔️ Visualização de task por id com sucesso
- ✔️ Não permitir visualizar task de outro usuário
- ✔️ Visualização de task inexistente
- ✔️ Visualização sem autorização

## Tasks - Remoção
- ✔️ Remoção de task com sucesso
- ✔️ Erro ao remover task já removida
- ✔️ Remoção de task inexistente
- ✔️ Remoção sem autorização
- ✔️ Impedir alteração de task de outro usuário
- ✔️ Impedir remoção de task de outro usuário

## Segurança
- ✔️ Bloqueio de login após várias tentativas inválidas (brute force)
- ✔️ Negar acesso de usuário comum a rota de admin
- ✔️ Negar alteração de role por usuário comum
- ✔️ Não permitir visualizar/remover task de outro usuário
- ✔️ Mensagem genérica para login com email inexistente (user enumeration)
- ✔️ Rejeitar payloads XSS no título da task
- ✔️ Rejeitar payloads SQL-like no título da task
- ✔️ Negar acesso com token expirado
- ✔️ Negar acesso com token malformado
- ✔️ Bloquear requisições após atingir o rate limit global
- ✔️ Retornar 404 ou 405 para método não permitido
- ✔️ Headers de segurança presentes
- ✔️ Rejeitar requisições sem Content-Type em endpoints que exigem JSON

## Integração e Infra
- ✔️ Conexão ao banco de dados com sucesso


---

**Atualizado em:** 18/06/2025
