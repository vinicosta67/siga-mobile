# 📱 SIGA Mobile - Documentação de Integração da API (Cliente Externo)

Este documento mapeia os principais endpoints, formatos de dados e fluxos necessários para conectar o **App React Native (siga-mobile)** ao Siga Backend. O foco desta documentação é o fluxo do **Cliente Final** (não inclui rotas administrativas ou de gerência de alto nível).

---

## 🔒 1. Base URL e Autenticação

A URL base para o aplicativo móvel acessar o backend (assumindo a porta local padrão durante o desenvolvimento):
`baseURL: http://<seu-ip-local>:5005/api` *(No React Native, não use `localhost`, use o IP da sua máquina na rede Wi-Fi).*

**Atenção:** Todas as rotas (exceto `/auth/login` e `/auth/register` e fluxos de senha) necessitam do cabeçalho de autorização.
```http
Authorization: Bearer <seu_token_jwt>
```

---

## 👤 2. Autenticação e Conta (`/api/auth`)

Esses endpoints gerenciam o ciclo de vida do usuário (Cliente) dentro da plataforma.

### 2.1 Cadastro (Register)
- **Método/Rota**: `POST /api/auth/register`
- **Descrição**: Cria uma nova conta de acesso.
- **Payload Necessário**:
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "senha_segura_123",
  "pfType": "FISICA" // ou "JURIDICA"
}
```

### 2.2 Login
- **Método/Rota**: `POST /api/auth/login`
- **Descrição**: Autentica o usuário e devolve o Token JWT.
- **Payload Necessário**:
```json
{
  "email": "joao@email.com",
  "password": "senha_segura_123"
}
```
- **Retorno Esperado**: Objeto contendo os dados do usuário (incluindo `id` e `role` dentro de permissions) e a string `token`. Este Token deve ser salvo no `AsyncStorage` (ou MMKV) do React Native.

### 2.3 Completar Perfil - Pessoa Física
- **Método/Rota**: `PUT /api/auth/:id/pf`
- **Descrição**: Completa ou atualiza os dados detalhados para clientes do tipo `FISICA`.
- **Payload (Principais Campos do Prisma)**:
```json
{
  "cpf": "123.456.789-00",
  "rg": "1234567",
  "birthDate": "1990-01-01T00:00:00.000Z",
  "maritalStatus": "SOLTEIRO",
  "monthlyIncome": 5000.00,
  "occupation": "Engenheiro",
  "zipCode": "12345-678",
  "address": "Rua das Flores",
  "addressNumber": "123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "phone": "(11) 99999-9999"
}
```

### 2.4 Completar Perfil - Pessoa Jurídica
- **Método/Rota**: `PUT /api/auth/:id/pj`
- **Descrição**: Completa ou atualiza os dados detalhados para clientes do tipo `JURIDICA`.
- **Payload (Principais Campos do Prisma)**:
```json
{
  "cnpj": "12.345.678/0001-90",
  "companyName": "Empresa Fictícia LTDA",
  "tradeName": "Nome Fantasia",
  "industry": "Comércio",
  "annualRevenue": 1000000.00,
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "12345-678"
}
```

### 2.5 Envio de Documentos do Usuário (CNH, RG, Comprovantes)
- **Método/Rota**: `POST /api/auth/:id/documents`
- **Descrição**: Envia a foto/pdf de um documento pessoal (usando `FormData` no React Native).
- **Formato**: `multipart/form-data`
- **Campos**:
  - `documentFile`: O arquivo físico (via expo-document-picker ou expo-image-picker).
  - `type`: String identificando (ex: "CNH", "COMPROVANTE_RESIDENCIA").

---

## 📑 3. Solicitação de Crédito (Propostas) (`/api/proposals`)

O núcleo do Siga: Envio e acompanhamento de propostas de crédito agrícola.

### 3.1 Criar Nova Proposta
- **Método/Rota**: `POST /api/proposals`
- **Descrição**: Submete uma nova proposta de crédito para análise.
- **Payload (Exemplo Baseado no Schema)**:
```json
{
  "title": "Financiamento de Trator Masey",
  "type": "AQUISICAO_MAQUINARIO",
  "requestedValue": 250000.00,
  "term": 48, 
  "purpose": "Aumentar a capacidade de colheita.",
  "department": "CECAD",
  "documentNumber": "123.456.789-00" // CPF ou CNPJ atrelado
}
```
*Dica RN: Utilize validação com Zod ou Yup no front-end para garantir que o Payload vai formatado corretamente antes do envio.*

### 3.2 Listar Minhas Propostas
- **Método/Rota**: `GET /api/proposals`
- **Descrição**: Busca todas as propostas atreladas ao ID do usuário logado (o backend faz esse filtro via token automaticamente).

### 3.3 Detalhe da Proposta
- **Método/Rota**: `GET /api/proposals/:proposalId`
- **Descrição**: Retorna o detalhe completo da proposta, incluindo SLAs, Status atual e Valores corrigidos.

### 3.4 Histórico e Andamento (Timeline)
- **Método/Rota**: `GET /api/proposals/:proposalId/timeline`
- **Descrição**: Retorna uma array de eventos mostrando a evolução do status do processo (útil para criar uma UI de "Linha do Tempo" vertical para o cliente).

### 3.5 Envio de Documentos atrelados à Proposta
- **Método/Rota**: `POST /api/proposals/:proposalId/documents`
- **Formato**: `multipart/form-data`
- **Campos**: `documentFile` (Arquivo) e `type` (Ex: "ORCAMENTO_TRATOR", "MATRICULA_FAZENDA").

---

## 🔔 4. Alertas e Notificações Push (`/api/alerts`)

Essencial para manter o cliente externo informado sobre os andamentos sem que ele precise abrir a proposta.

### 4.1 Buscar Alertas do Usuário
- **Método/Rota**: `GET /api/alerts`
- **Params**: `?unreadOnly=true` (Opcional - traz apenas não lidos).
- **Retorno Esperado**:
```json
[
  {
    "id": "uuid-do-alerta",
    "title": "Proposta Aprovada!",
    "message": "Seu financiamento do Trator Masey foi aprovado pela diretoria.",
    "type": "INFO",
    "isRead": false,
    "createdAt": "2026-06-18T10:00:00Z"
  }
]
```

### 4.2 Marcar Alerta como Lido
- **Método/Rota**: `PUT /api/alerts/:id/read`
- **Descrição**: Informa ao backend que o alerta foi visto para remover a bolinha vermelha do App.

---

## 🛠️ Recomendações e Boas Práticas (React Native + Siga Backend)

1. **Uploads em RN (`multipart/form-data`)**:
   Para enviar arquivos de imagem/PDF para as rotas `/documents` usando Fetch/Axios, seu `FormData` precisa de uma estrutura explícita:
   ```javascript
   const formData = new FormData();
   formData.append('documentFile', {
     uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
     type: 'image/jpeg', // ou 'application/pdf'
     name: 'documento.jpg'
   });
   ```

2. **React Query / Zustand**: Recomendo fortemente usar o React Query (`@tanstack/react-query`) para chamadas das Propostas e Alertas, pois ele cacheia os resultados e fornece estados de Loading embutidos excelentes para Apps Mobile.

3. **Validação**: Todas as rotas acima passam por middlewares `protect` que exigem JWT. Trate com cuidado respostas `401 Unauthorized` no React Native e deslogue o usuário automaticamente, direcionando para a tela de Login (`navigation.reset()`).

4. **WebSockets (Chat / Live Updates)**: 
   Para conexões Socket.io (notificações instantâneas e chats), inicialize o client conectando à mesma URL do Express (`http://<seu-ip-local>:5005`) passando o token JWT em `auth`:
   ```javascript
   import { io } from "socket.io-client";
   const socket = io("http://SEU_IP:5005", { auth: { token: 'seu-jwt' } });
   ```
