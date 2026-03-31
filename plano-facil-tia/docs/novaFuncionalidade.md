# Como adicionar uma nova funcionalidade com limite de uso

Este guia descreve o passo a passo para integrar uma nova funcionalidade de IA ao sistema de limites configuráveis do Plano Fácil Tia.

---

## Visão geral da arquitetura

O sistema de limites é composto por:

- `FuncionalidadeTipo` — enum no Prisma que identifica cada funcionalidade
- `ConfigLimite` — tabela no banco com os limites por `(planoTipo, funcionalidade)`
- `UsageLog` — tabela que rastreia o uso por usuária, funcionalidade, mês e ano
- `lib/limites.ts` — serviço central com `verificarLimite` e `incrementarUso`

Adicionar uma nova funcionalidade **não exige alterar o `LimitesService`**. Apenas o enum, o banco e a nova rota precisam ser tocados.

---

## Passo a passo

### 1. Adicionar ao enum `FuncionalidadeTipo`

Editar `prisma/schema.prisma`:

```prisma
enum FuncionalidadeTipo {
  GERAR_PLANO
  GERAR_RELATORIO  // ← novo valor
}
```

### 2. Gerar e aplicar a migration

```bash
cd plano-facil-tia
./node_modules/.bin/prisma migrate dev --name add_<nome_da_funcionalidade>
```

### 3. Inserir os limites no banco

Adicionar ao `prisma/seed.ts` (ou executar direto no banco):

```ts
await prisma.configLimite.createMany({
  data: [
    {
      planoTipo:      "TRIAL",
      funcionalidade: "GERAR_RELATORIO",
      limiteTotal:    1,       // total de usos no trial
      limiteDiario:   null,
      limiteMensal:   null,
    },
    {
      planoTipo:      "PROFESSORA",
      funcionalidade: "GERAR_RELATORIO",
      limiteMensal:   5,       // usos por mês
      limiteDiario:   2,       // usos por dia
      limiteTotal:    null,
    },
    {
      planoTipo:      "ESCOLA",
      funcionalidade: "GERAR_RELATORIO",
      limiteMensal:   null,    // ilimitado (ou definir um valor)
      limiteDiario:   null,
      limiteTotal:    null,
    },
  ],
  skipDuplicates: true,
})
```

Rodar o seed:

```bash
./node_modules/.bin/prisma db seed
```

### 4. Usar na nova rota

Em qualquer rota de API que use a nova funcionalidade:

```ts
import { verificarLimite, incrementarUso } from "@/lib/limites"
import { FuncionalidadeTipo } from "@prisma/client"

// Antes de chamar a IA:
const resultado = await verificarLimite(userId, FuncionalidadeTipo.GERAR_RELATORIO)
if (!resultado.permitido) {
  return Response.json(
    { erro: resultado.erro, liberaEm: resultado.liberaEm },
    { status: resultado.erro === "LIMITE_DIARIO" ? 429 : 403 }
  )
}

// ... lógica da funcionalidade ...

// Após concluir com sucesso:
await incrementarUso(userId, FuncionalidadeTipo.GERAR_RELATORIO)
```

---

## Ajustando limites sem deploy

O Admin pode alterar os limites diretamente na tabela `ConfigLimite` no banco, sem necessidade de novo deploy:

```sql
-- Exemplo: aumentar limite mensal da PROFESSORA para GERAR_RELATORIO
UPDATE "ConfigLimite"
SET "limiteMensal" = 10, "updatedAt" = now()
WHERE "planoTipo" = 'PROFESSORA'
  AND "funcionalidade" = 'GERAR_RELATORIO';
```

Se não houver registro no banco para uma combinação `(planoTipo, funcionalidade)`, o `LimitesService` usa os defaults hardcoded definidos em `lib/limites.ts`.

---

## Códigos de erro retornados

| Código | Status HTTP | Quando ocorre |
|---|---|---|
| `TRIAL_EXPIRADO` | 403 | Trial de 14 dias expirou |
| `LIMITE_TRIAL` | 403 | Atingiu o `limiteTotal` do TRIAL |
| `LIMITE_MENSAL` | 403 | Atingiu o `limiteMensal` do mês |
| `LIMITE_DIARIO` | 429 | Atingiu o `limiteDiario` do dia |

O campo `liberaEm` é retornado junto com `LIMITE_DIARIO` contendo o horário de liberação em ISO 8601.

---

## Reset automático

Os contadores mensais (`totalMes`) são zerados automaticamente no dia 1 de cada mês pelo cron job configurado em `vercel.json`:

```json
{ "path": "/api/cron/reset-contadores", "schedule": "0 0 1 * *" }
```

O cron é protegido pela variável `CRON_SECRET` no `.env`. Requer plano Pro na Vercel.

---

## Arquivos relevantes

| Arquivo | Papel |
|---|---|
| `prisma/schema.prisma` | Enum `FuncionalidadeTipo` e tabelas `ConfigLimite` / `UsageLog` |
| `prisma/seed.ts` | Seed dos limites iniciais |
| `lib/limites.ts` | `verificarLimite`, `incrementarUso`, `buscarConfigLimite` |
| `app/api/cron/reset-contadores/route.ts` | Reset mensal dos contadores |
| `vercel.json` | Configuração do cron job |
