---
trigger: always_on
---

---
description: Padrões de arquitetura React Native (Expo) e fluxo de trabalho TDD obrigatório para o projeto mobile.
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---
# React Native & Mobile Standards

## Test-Driven Development (TDD) Obrigatório
- **Red-Green-Refactor:** Você DEVE escrever os testes ANTES da implementação do código funcional. Nenhuma feature ou componente deve ser criado sem um teste falho prévio.
- Utilize `jest` e `@testing-library/react-native`.
- Teste comportamentos e fluxos de usuário, não detalhes de implementação da UI.
- Mock de bibliotecas nativas e integrações (como `react-native-mmkv` e requisições do `axios`) deve ser feito no setup dos testes.

## Estrutura de Pastas e Roteamento (Expo Router)
- `/app`: Exclusivo para roteamento baseado em arquivos do Expo Router. Mantenha a separação por grupos (ex: `(auth)`, `(tabs)`). **A lógica de negócio não deve residir aqui.**
- O roteamento deve suportar a navegação de forma isolada, garantindo que trilhas de usuários distintas (como rotas exclusivas para contas PF ou PJ) não se misturem na camada de visualização.
- Arquivos no `/app` devem atuar apenas como "Controllers" de tela, importando os templates/organismos do `/src`.

## Arquitetura de Componentes (Atomic Design)
- Todo o código de UI deve residir em `/src/components` e seguir os princípios do Atomic Design:
  - `atoms`: Componentes indivisíveis (botões, inputs, tipografia).
  - `molecules`: Combinação de átomos (grupos de input com label).
  - `organisms`: Seções complexas da interface (formulários completos, headers).
  - `templates`: Estruturas de página (layouts base onde os dados serão injetados).

## Padrões de Tech Stack
- **Estilização:** Utilize exclusivamente `nativewind` e as classes utilitárias do Tailwind CSS. Evite `StyleSheet.create`.
- **Formulários e Validação:** Use `react-hook-form` sempre em conjunto com `@hookform/resolvers/zod`. Nenhuma entrada de dados deve ocorrer sem validação estrita do Zod.
- **Gerenciamento de Estado (Abordagem Híbrida):**
  - **Estado de Servidor (Server State):** Utilize React Query para todo o data fetching, gerenciamento de cache, sincronização e mutações de dados da API. NUNCA crie reducers/actions manuais no Redux para lidar com estados de requisição (loading, success, error).
  - **Estado de Cliente (Client State):** Utilize `@reduxjs/toolkit` estritamente para estados globais da interface que não são derivados da API e precisam ser acessados por múltiplas telas (ex: dados temporários de um formulário multi-etapas complexo).
  - **Armazenamento Persistente:** Utilize `react-native-mmkv` exclusivamente para salvar dados críticos de sessão (como tokens JWT) e preferências locais simples do usuário, aproveitando seu acesso síncrono e alta performance.
- **Requisições:** Centralize as chamadas de API usando `axios`, implementando interceptors para injeção de tokens de autenticação e tratamento de erros globais.