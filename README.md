# Projeção Brutal

> Descubra o custo real das suas escolhas hoje e o que você pode alcançar com disciplina em 5 anos.

## Stack

- **Next.js 14** com App Router
- **TypeScript** strict mode
- **TailwindCSS** com tema customizado
- **Supabase** para auth e banco de dados
- **OpenAI GPT-4o** (opcional) para relatório de análise

---

## Setup

### 1. Clone e instale dependências

```bash
git clone <seu-repo>
cd projecao-brutal
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
OPENAI_API_KEY=sk-...   # opcional
```

### 3. Configure o banco de dados no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `supabase/migrations.sql`

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Estilos globais
│   ├── auth/
│   │   ├── login/page.tsx        # Página de login
│   │   └── cadastro/page.tsx     # Página de cadastro
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard com histórico
│   ├── diagnostico/
│   │   ├── page.tsx              # Página do formulário
│   │   └── DiagnosticoForm.tsx   # Componente client-side
│   └── resultado/
│       └── page.tsx              # Resultado do diagnóstico
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client (browser)
│   │   ├── server.ts             # Supabase client (server)
│   │   └── middleware.ts         # Session refresh middleware
│   └── openai.ts                 # Integração OpenAI
├── utils/
│   ├── calculations.ts           # Lógica de cálculo isolada
│   └── formatters.ts             # Formatadores de UI
├── types/
│   └── index.ts                  # Tipos TypeScript centrais
└── middleware.ts                 # Middleware de proteção de rotas
supabase/
└── migrations.sql                # SQL para setup do banco
```

---

## Lógica de Cálculo

Toda a lógica está em `src/utils/calculations.ts`:

| Variável | Fórmula |
|---|---|
| `five_year_wasted_hours` | `hours_wasted_per_day × 365 × 5` |
| `five_year_money_wasted` | `monthly_impulsive × 12 × 5` |
| `projected_income_unchanged` | `renda_anual × (1.02)^5 / 12` |
| `projected_income_disciplined` | `renda_anual × (1.10)^5 / 12` |
| `discipline_score` | Base 50 + bônus estudo + penalidade desperdício |

---

## Integração OpenAI

Configure `OPENAI_API_KEY` no `.env.local` para ativar análise real via GPT-4o.

Sem a variável, o sistema exibe um relatório mock coerente com os dados do usuário.

---

## Deploy

### Vercel (recomendado)

```bash
vercel deploy
```

Configure as variáveis de ambiente no dashboard da Vercel.
