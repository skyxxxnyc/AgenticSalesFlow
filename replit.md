# AUTOSALES.AI - Autonomous CRM

## Overview

AUTOSALES.AI is a fully autonomous agentic CRM platform designed for freelancers and small teams. The application features three AI agents that work together to find leads, craft outreach campaigns, and automate sales workflows. Built as a modern full-stack web application, it combines a React-based frontend with an Express.js backend, utilizing PostgreSQL for data persistence and Replit's authentication system for user management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Tailwind CSS v4 with custom theming for styling
- Wouter for client-side routing
- TanStack Query (React Query) for server state management

**Design System:**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Custom "neo-brutalist" design aesthetic with bold borders, shadows, and geometric patterns
- Responsive layout with mobile-first approach
- Custom fonts: Space Grotesk (sans-serif) and JetBrains Mono (monospace)

**State Management:**
- TanStack Query for API data fetching and caching
- React hooks for local component state
- Custom hooks for authentication (`useAuth`)

**Routing Strategy:**
- Public route: Landing page for unauthenticated users
- Protected routes: Dashboard, Leads, Agents, Campaigns, Settings
- Authentication-based conditional rendering using Wouter

### Backend Architecture

**Framework & Runtime:**
- Express.js as the web server framework
- Node.js with ESM modules
- TypeScript for type safety across the stack

**API Design:**
- RESTful API endpoints under `/api` prefix
- Session-based authentication with Replit OpenID Connect
- Protected routes using `isAuthenticated` middleware
- CRUD operations for leads, campaigns, and agent configurations

**Database Layer:**
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL as the database provider
- WebSocket connection pooling for optimal performance
- Schema-first approach with shared TypeScript types

**Authentication & Sessions:**
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js with custom OpenID Client strategy
- PostgreSQL session store (`connect-pg-simple`)
- Session TTL: 7 days with secure, httpOnly cookies

**Build Process:**
- esbuild for server-side bundling
- Selective dependency bundling (allowlist) to optimize cold starts
- Production build outputs to `dist/` directory
- Vite for client-side builds with HMR in development

### Data Storage Solutions

**Database Schema:**

1. **Sessions Table** - Required for Replit Auth session management
   - Stores serialized session data with expiration timestamps
   - Indexed on expire column for efficient cleanup

2. **Users Table** - User profile information
   - UUID primary key (auto-generated)
   - Email, first name, last name, profile image URL
   - Created/updated timestamps

3. **Leads Table** - Contact/prospect management
   - UUID primary key
   - Foreign key to users table
   - Fields: name, company, email, phone, status, score, notes, tags
   - Timestamps for creation and updates

4. **Campaigns Table** - Marketing/outreach campaigns
   - UUID primary key
   - Foreign key to users table
   - Fields: name, type, status, target audience, messaging
   - Timestamps for creation and updates

5. **Agent Configs Table** - AI agent configuration
   - UUID primary key
   - Foreign key to users table
   - Stores agent-specific settings and parameters

**Data Access Pattern:**
- Repository pattern implementation through `IStorage` interface
- User-scoped data queries (all operations filter by userId)
- Upsert operations for user and agent config management

### External Dependencies

**Database & Infrastructure:**
- Neon Serverless PostgreSQL - Cloud-native PostgreSQL database
- Requires `DATABASE_URL` environment variable
- Uses WebSocket connections via `ws` package

**Authentication:**
- Replit OpenID Connect (OIDC) provider
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables
- Memoized OIDC configuration with 1-hour cache

**UI Component Libraries:**
- Radix UI - Headless component primitives for accessibility
- Lucide React - Icon library
- Framer Motion - Animation library (used in agent and metric cards)
- Recharts - Charting library for data visualization

**Development Tools:**
- Replit-specific Vite plugins for development banner and cartographer
- Custom meta images plugin for OpenGraph/Twitter card management
- Runtime error overlay for better DX

**Form Handling:**
- React Hook Form for form state management
- Zod for schema validation
- `@hookform/resolvers` for Zod integration
- `drizzle-zod` for automatic schema generation from Drizzle tables

**Build & Development:**
- TypeScript for static typing
- ESLint/Prettier configuration (implied by project structure)
- Path aliases for cleaner imports (`@/`, `@shared/`, `@assets/`)