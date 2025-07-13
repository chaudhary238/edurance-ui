# Insurance Policy Analysis Application

## Overview

This is a modern full-stack web application built for insurance policy analysis using AI-powered insights. The application allows users to upload, search, and analyze insurance policies with a clean, professional interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

## Key Components

### Database Schema
- **Users Table**: Stores user authentication and profile information
- **Policies Table**: Contains insurance policy details (policy number, type, premium, coverage)
- **Policy Analyses Table**: Stores AI-generated analysis results and recommendations

### Authentication System
- Mock authentication system (currently uses user ID 1 for demo purposes)
- Session-based authentication ready for implementation
- User roles and membership types supported

### Policy Management
- Policy upload and storage
- Search functionality across policy names and numbers
- Policy categorization by type (auto, home, life, health)
- Status tracking (active, inactive, expired)

### UI Components
- Responsive design with mobile-first approach
- Sidebar navigation with proper route handling
- Search interface with real-time results
- Policy cards with status indicators and icons
- Quick action buttons for common tasks

## Data Flow

1. **User Authentication**: Mock user system returns user profile
2. **Policy Retrieval**: Fetch policies by user ID with search filtering
3. **Policy Analysis**: Store and retrieve AI analysis results
4. **Real-time Updates**: TanStack Query handles caching and synchronization
5. **Responsive UI**: Components update based on data state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Accessible UI primitives
- **wouter**: Lightweight routing solution
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **drizzle-kit**: Database migrations and schema management
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static files
2. **Backend Build**: ESBuild bundles Node.js server
3. **Database Migrations**: Drizzle pushes schema changes
4. **Static Assets**: Served from dist/public directory

### Environment Configuration
- **Development**: Hot reload with Vite middleware
- **Production**: Compiled static files with Express server
- **Database**: Uses DATABASE_URL environment variable for connection

### Scalability Considerations
- **Database**: Serverless PostgreSQL scales automatically
- **Frontend**: Static files can be served from CDN
- **Backend**: Stateless Express server supports horizontal scaling
- **Sessions**: PostgreSQL session store supports clustering

## Recent Changes (January 2025)

### Complete Application Pages
- **Dashboard**: Main policy analysis interface with search, quick actions, and recent policies
- **Glossary**: Interactive insurance terms dictionary with search and expandable definitions
- **Personalized Management**: Policy insights, renewal reminders, and life event analysis
- **Advanced Guidance**: Coverage gap analysis, needs assessment tool, and myth debunking
- **Help Center**: Searchable help articles, video tutorials, and support categories
- **Contact Support**: Multiple contact methods with comprehensive contact form

### UI Enhancements
- **Modern Design**: Clean, professional interface with consistent styling
- **Interactive Components**: Expandable sections, hover effects, and smooth transitions
- **Data Visualization**: Charts for coverage analysis using Recharts
- **Form Handling**: Complete contact forms with validation and submission states
- **Responsive Layout**: Mobile-first design with proper breakpoints

The application is structured as a monorepo with shared TypeScript definitions, making it easy to maintain type safety across the full stack while keeping the codebase organized and maintainable.