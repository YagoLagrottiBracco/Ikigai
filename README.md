# Ikigai - Descubra seu Propósito 🎯

Aplicação web completa para descoberta de propósito e carreira através do método Ikigai, com análise personalizada por IA.

## 🛠 Stack

- **Backend**: NestJS (DDD + TDD)
- **Frontend**: Next.js 14 (Atomic Design + shadcn/ui + Tailwind)
- **Database**: MongoDB
- **IA**: Google Gemini

## 📁 Estrutura

```
ikigai/
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Next.js Frontend
├── packages/
│   └── shared/       # Tipos compartilhados
└── docker-compose.yml
```

## 🚀 Primeiros Passos

### Pré-requisitos

- Node.js 20+
- MongoDB (local ou Atlas)
- Chave da API Gemini

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar MongoDB (desenvolvimento local)
docker-compose up -d

# Rodar em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
MONGODB_URI=mongodb://localhost:27017/ikigai
GEMINI_API_KEY=sua_chave_aqui
```

## 📝 Scripts

```bash
npm run dev        # Inicia API e Web em paralelo
npm run dev:api    # Inicia apenas a API
npm run dev:web    # Inicia apenas o Web
npm run build      # Build de produção
npm run test       # Executa todos os testes
```

## 🎨 Design

A aplicação utiliza um design harmonioso com tons terrosos e naturais, criando uma experiência calma e reflexiva para o usuário.

## 📄 Licença

MIT
