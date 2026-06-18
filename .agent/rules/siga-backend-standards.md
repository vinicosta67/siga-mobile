---
trigger: model_decision
description: Utilize essas regras apenas quando precisa fazer uma alteração no projeto do siga-backend
---

# Padrões de Qualidade e Segurança do SIGA Backend

Sempre que você for escrever, refatorar ou analisar código neste repositório, você DEVE seguir estritamente as regras abaixo:

1. **Validação Estrita:** Nenhum endpoint Express ou Worker do BullMQ pode processar dados sem antes validá-los usando um Schema do `Zod`. A tipagem deve ser inferida do schema (`z.infer`).
2. **Alta Volumetria (1000 req/s):** Nunca use loops bloqueantes (síncronos) na thread principal. Delegue consultas a APIs lentas de terceiros estritamente para as filas do `Redis + BullMQ`.
3. **Banco de Dados:** É estritamente proibido escrever queries SQL cruas. Use exclusivamente o `Prisma ORM`. Em consultas de listagem com muitas relações, SEMPRE implemente paginação (take/skip) para evitar estouro de memória sob carga.
4. **Segurança (OCI Vault):** Nunca crie variáveis hardcoded ou leia chaves de API diretamente de process.env soltos. Utilize a classe de integração de segredos estabelecida no projeto.