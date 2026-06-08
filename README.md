[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node.js-20%2B-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)

# Ikigai Platform

A full-stack web application for purpose discovery and career alignment through the Ikigai framework, powered by generative AI and built with enterprise-grade architecture patterns.

## Overview

Ikigai Platform guides users through a structured inquiry process to identify the intersection of:
- What they love (passion)
- What they excel at (skills)
- What the world needs (market demand)
- What they can be compensated for (economic value)

The platform delivers personalized AI-generated analysis, exportable insights, and actionable recommendations. Built with production-ready patterns including Domain-Driven Design (DDD), Value Objects, Aggregate Roots, and repository abstractions.

**Key Characteristics:**
- Full-stack monorepo architecture with independent API and web tier scaling
- End-to-end type safety via shared TypeScript types across frontend and backend
- Stateless API design enabling horizontal scaling
- Modular domain entities supporting future feature expansion
- Integration with LLM APIs for personalized analysis at scale

---

## Architecture

### Design Philosophy

The platform implements a **layered, domain-driven architecture** optimized for maintainability, testability, and team scalability:

```
Presentation Layer (HTTP Controllers, DTOs)
     ↓
Application Layer (Use Cases, Orchestration)
     ↓
Domain Layer (Entities, Value Objects, Business Rules)
     ↓
Infrastructure Layer (Database, External Services, Repositories)
```

### Architectural Decisions

**1. Domain-Driven Design (DDD)**
- **Why**: Encapsulates business complexity into bounded contexts. The domain model (`IkigaiSessionEntity`, `IkigaiAnswersVO`, `AIAnalysisVO`) directly reflects business processes, reducing impedance mismatch between domain experts and code.
- **Trade-off**: Initial overhead in entity modeling pays dividends as domain logic expands.

**2. Value Objects for Immutability**
- **Why**: `IkigaiAnswersVO`, `UserContextVO`, and `AIAnalysisVO` enforce type safety and prevent invalid state transitions. Used in place of primitive types to document intent and enforce invariants.
- **Benefit**: Eliminates entire categories of bugs (null pointer, type confusion). Self-documenting API.

**3. Aggregate Root Pattern**
- **Why**: `IkigaiSessionEntity` serves as the aggregate root, ensuring all related data (answers, analysis, context) is modified through controlled methods. Simplifies transaction boundaries to a single entity.
- **Scalability**: Enables future sharding strategies by session ID.

**4. Monorepo with Workspace Isolation**
- **Why**: Shared TypeScript types (`@ikigai/shared`) eliminate versioning friction and runtime type mismatches. Each app (`api`, `web`) has independent CI/CD, deployment, and dependency management.
- **Tools**: npm workspaces for minimal overhead, no additional tooling required.

**5. Use Case Layer for Application Logic**
- **Why**: Decouples HTTP concerns from business logic. Use cases (`CreateSessionUseCase`, `AnalyzeSessionUseCase`) are framework-agnostic and can be invoked from CLI, webhooks, or jobs.
- **Testability**: Mock-friendly, no framework coupling.

**6. Repository Abstraction**
- **Why**: Interface-based repository pattern (`SessionRepository`) allows seamless database swaps (MongoDB → PostgreSQL) without domain logic changes.
- **Design**: Repositories are bound to aggregates, not tables.

### Data Model

```typescript
IkigaiSession (Aggregate Root)
  ├── id: string (unique identifier)
  ├── hash: string (shareable result URL)
  ├── context: UserContext (value object)
  │   ├── language: string
  │   ├── timezone: string
  │   └── metadata: object
  ├── answers: IkigaiAnswersVO (value object)
  │   ├── passion: string[]
  │   ├── skills: string[]
  │   ├── market_needs: string[]
  │   └── compensation: string[]
  ├── aiAnalysis: AIAnalysisVO | null (value object)
  │   ├── insights: string
  │   ├── recommendations: string[]
  │   └── generated_at: timestamp
  ├── status: SessionStatus (in_progress | completed | archived)
  ├── createdAt: timestamp
  └── updatedAt: timestamp
```

### API Design

RESTful endpoints following resource-oriented design:

```
POST   /sessions                    → Create new session
GET    /sessions/:id                → Retrieve session state
PATCH  /sessions/:id                → Update answers (idempotent)
POST   /sessions/:id/analyze        → Trigger AI analysis
GET    /sessions/:id/export         → Export as PDF
POST   /sessions/:id/share          → Generate shareable link
```

All endpoints return `Content-Type: application/json` with consistent error schemas. Stateless design enables CDN caching of analysis results.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Language** | TypeScript 5.7 | Full-stack type safety, zero-cost abstraction over JavaScript |
| **Backend Runtime** | Node.js 20+ LTS | Production-grade, supported ecosystem |
| **Backend Framework** | NestJS 11 | Opinionated structure, built-in IoC container, decorator-driven architecture |
| **Frontend Framework** | Next.js 16 | React 18, built-in SSR, API routes, image optimization, zero-config deployment |
| **UI Library** | shadcn/ui + Radix UI | Headless components, full accessibility (WCAG 2.1), style-agnostic |
| **Styling** | Tailwind CSS 3.4 | Utility-first, tree-shakeable CSS, 5KB+ gzipped |
| **Database** | MongoDB 8+ | Document model aligns with domain value objects, horizontal scaling |
| **Database ORM** | Mongoose 8.9 | Schema validation, middleware hooks for cross-cutting concerns |
| **Generative AI** | Google Gemini API | Cost-effective, multimodal, streaming support |
| **Payment Processing** | Stripe v17 | PCI-DSS compliance, webhook reliability, test/live mode symmetry |
| **Email Delivery** | Resend API | Transactional email, React component support |
| **PDF Generation** | pdfkit | Lightweight, no external binary dependencies |
| **Testing Framework** | Jest 29.7 | Zero-config setup, snapshot testing, parallel execution |
| **Containerization** | Docker + Compose | Reproducible development, production parity |
| **Package Management** | npm 10.9+ workspaces | Built-in monorepo support, no Lerna/Yarn lock-in |

---

## Getting Started

### Prerequisites

- **Node.js**: 20.x LTS or higher
- **npm**: 10.9+ (included with Node.js)
- **MongoDB**: 8.0+ (local via Docker or cloud at Atlas)
- **API Keys**: Google Gemini, Stripe, Resend

### Installation

```bash
# Clone repository
git clone <repository-url>
cd ikigai-platform

# Install dependencies across all workspaces
npm install

# Build shared types package
npm run build:shared
```

### Local Development

```bash
# Start MongoDB container in background
docker-compose up -d

# Start API (port 3001) and Web (port 3000) concurrently
npm run dev

# Or start services independently
npm run dev:api    # Backend only, port 3001
npm run dev:web    # Frontend only, port 3000
```

#### Verify Setup

```bash
# API Health Check
curl http://localhost:3001/health

# Web App
open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the repository root:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/ikigai

# Generative AI
GEMINI_API_KEY=<your-google-generative-ai-key>

# Payment Processing
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<stripe-public-key>
STRIPE_WEBHOOK_SECRET=<webhook-endpoint-secret>

# Email
RESEND_API_KEY=<resend-api-key>

# API Configuration
API_URL=http://localhost:3001
API_PORT=3001
NODE_ENV=development

# Web Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Configuration Precedence**: `.env.local` > `.env` > application defaults

---

## Building for Production

```bash
# Build all packages and workspaces
npm run build

# Output structure:
# apps/api/dist/          → NestJS compiled application
# apps/web/.next/         → Next.js optimized bundle
# packages/shared/dist/   → Shared type definitions
```

### Deployment Considerations

- **API**: Stateless Node.js application, can be containerized and scaled horizontally
- **Frontend**: Next.js supports serverless deployment (Vercel) or Node.js servers
- **Database**: MongoDB connection pooling required for production; use Atlas or managed instance
- **Environment**: All configuration via environment variables (12-factor app compliance)

---

## API Endpoints

### Session Management

**Create Session**
```http
POST /sessions
Content-Type: application/json

{
  "language": "pt-BR",
  "timezone": "America/Sao_Paulo"
}

Response 201:
{
  "id": "sess_abc123",
  "hash": "result_xyz789",
  "status": "in_progress",
  "createdAt": "2026-06-08T10:00:00Z"
}
```

**Retrieve Session**
```http
GET /sessions/:id

Response 200:
{
  "id": "sess_abc123",
  "status": "in_progress",
  "answers": {
    "passion": [...],
    "skills": [...],
    "market_needs": [...],
    "compensation": [...]
  },
  "aiAnalysis": null,
  "updatedAt": "2026-06-08T10:05:00Z"
}
```

**Update Answers** (idempotent)
```http
PATCH /sessions/:id
Content-Type: application/json

{
  "passion": ["problem solving", "mentoring"],
  "skills": ["system design", "distributed systems"]
}

Response 200: Updated session object
```

**Trigger Analysis**
```http
POST /sessions/:id/analyze

Response 202: Async analysis queued
{
  "id": "sess_abc123",
  "status": "analyzing"
}
```

**Export as PDF**
```http
GET /sessions/:id/export?format=pdf

Response 200: application/pdf
Content-Disposition: attachment; filename="ikigai-analysis-2026-06-08.pdf"
```

---

## Design Decisions

### 1. **Shared TypeScript Package**
- **Decision**: Deduplicate type definitions in `packages/shared`
- **Rationale**: Frontend and backend must agree on contracts; single source of truth prevents type mismatches at runtime
- **Trade-off**: Requires building shared package before dependent apps

### 2. **MongoDB over Relational Database**
- **Decision**: Document store for session data
- **Rationale**: Session documents map naturally to domain value objects; embedded arrays (passion, skills, etc.) avoid complex JOIN queries
- **Consideration**: Non-normalized schema; foreign key relationships handled at application layer

### 3. **Google Gemini API over OpenAI**
- **Decision**: Use Gemini for AI analysis
- **Rationale**: Cost profile, multimodal support, lower latency, competitive pricing for text-only workloads
- **Trade-off**: Vendor lock-in mitigated by abstraction layer (`AIService`)

### 4. **Atomic Design System**
- **Decision**: Structure UI components as Atoms → Molecules → Organisms
- **Rationale**: Forces reusability constraints early; scales to large design systems
- **Tooling**: shadcn/ui provides production-ready primitives

### 5. **Monorepo (npm workspaces)**
- **Decision**: Single Git repository, multiple publishable packages
- **Rationale**: Simplifies shared type deployments; avoids API versioning friction
- **Alternative Considered**: Separate repositories (rejected due to type drift risk)

### 6. **Stripe for Payments**
- **Decision**: Outsource payment processing to PCI-DSS certified platform
- **Rationale**: Reduces compliance burden, webhook-driven architecture decouples from core logic
- **Implementation**: Session creation can optionally trigger Stripe checkout flow

---

## Project Structure

```
.
├── apps/
│   ├── api/                          # NestJS backend service
│   │   ├── src/
│   │   │   ├── domain/               # Domain layer (entities, value objects, business rules)
│   │   │   │   ├── entities/         # Aggregate roots, domain objects
│   │   │   │   ├── repositories/     # Repository interfaces
│   │   │   │   ├── services/         # Domain services (AIService, PDFService)
│   │   │   │   └── value-objects/    # Immutable value objects
│   │   │   ├── application/          # Application layer (use cases)
│   │   │   │   └── use-cases/        # Orchestration logic
│   │   │   ├── infrastructure/       # Infrastructure layer (external integrations)
│   │   │   │   ├── database/         # MongoDB schemas, repository implementations
│   │   │   │   └── external/         # Stripe, Gemini, Resend, PDF adapters
│   │   │   ├── presentation/         # Presentation layer (HTTP controllers)
│   │   │   │   ├── controllers/      # REST endpoints
│   │   │   │   └── dto/              # Data Transfer Objects (request/response)
│   │   │   ├── app.module.ts         # Root DI container
│   │   │   └── main.ts               # Application entrypoint
│   │   ├── jest.config.js
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── web/                          # Next.js frontend application
│       ├── src/
│       │   ├── app/                  # App Router (Next.js 13+)
│       │   │   ├── layout.tsx        # Root layout
│       │   │   ├── page.tsx          # Home page
│       │   │   ├── questionario/     # Quiz page
│       │   │   ├── resultado/        # Results detail view
│       │   │   ├── wrapped/          # Shareable results (dynamic routes)
│       │   │   ├── admin/            # Admin dashboard
│       │   │   └── checkout/         # Payment page
│       │   ├── components/
│       │   │   ├── atoms/            # Basic UI primitives (Button, Input, Label)
│       │   │   ├── molecules/        # Composite components (FormField, ProgressBar)
│       │   │   └── organisms/        # Page-level components (SessionForm, ResultsCard)
│       │   ├── lib/
│       │   │   ├── api.ts            # HTTP client with error handling
│       │   │   ├── utils.ts          # Utility functions
│       │   │   └── i18n/             # Internationalization (pt-BR, en-US, etc.)
│       │   └── globals.css           # Tailwind directives
│       ├── public/                   # Static assets, manifest
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                       # Shared type definitions and constants
│       ├── src/
│       │   ├── types/
│       │   │   ├── api.ts            # Shared API types (request/response)
│       │   │   └── ikigai.ts         # Domain types (SessionStatus, IkigaiAnswers)
│       │   └── index.ts              # Public exports
│       ├── tsconfig.json
│       └── package.json
│
├── docker-compose.yml                # MongoDB + dev environment
├── package.json                      # Root workspace configuration
├── tsconfig.json                     # TypeScript configuration (root)
└── README.md                         # This file
```

---

## Scripts Reference

```bash
# Development
npm run dev              # Start API and Web concurrently with file watching
npm run dev:api         # Start backend API only (port 3001)
npm run dev:web         # Start frontend only (port 3000)

# Building
npm run build            # Compile all workspaces (api, web, shared)
npm run build:shared     # Compile shared package only

# Quality Assurance
npm run test             # Run all unit tests across workspaces
npm run lint             # Lint TypeScript and identify style issues

# Deployment
npm start                # Start production server (requires NODE_ENV=production)
```

---

## Performance Considerations

### API
- Stateless design enables horizontal scaling via load balancers
- MongoDB indexing on session ID and hash for O(1) lookups
- Async analysis via background jobs (Stripe webhooks decouple payment processing)

### Frontend
- Next.js static generation for marketing pages
- React Server Components reduce JavaScript bundle size
- Tailwind CSS purges unused styles (5KB CSS typically)
- Image optimization via `next/image` component

### Database
- Connection pooling via Mongoose connection pool (default: 10 connections)
- Aggregate-based queries minimize JOIN operations
- Document-oriented design reduces N+1 query problems

---

## Contributing

This is a personal portfolio project. For usage or inquiries, please refer to the MIT license.

---

## License

MIT License – See LICENSE file for details

---

## Contact & Support

- **Email**: yago.lagrotti@gmail.com
- **GitHub**: https://github.com/YagoLagrottiBracco
- **Portfolio**: [\[Portfolio\]](https://lagrotti.dev/)

---

**Last Updated**: June 2026
