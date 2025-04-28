# AssuredGig - Freelance Platform

A modern freelance platform built with Next.js 14, TypeScript, and Tailwind CSS. The platform allows clients to post jobs and freelancers to find work, with features like real-time messaging, secure payments, and portfolio management.

## Overview

AssuredGig is a comprehensive freelance marketplace that connects talented freelancers with clients seeking professional services. The platform emphasizes security, transparency, and user experience, making it easy for both parties to collaborate effectively.

### Key Benefits

- **For Freelancers**: Find relevant projects, showcase your portfolio, and manage your work efficiently
- **For Clients**: Post jobs, review proposals, and collaborate with skilled professionals
- **For Both**: Secure payments, real-time communication, and transparent workflow

## Features

- 🔐 **Authentication & Authorization**
  - Email/Password authentication
  - Role-based access control (Client, Freelancer, Admin)
  - Protected routes and API endpoints
  - Local storage-based user management

- 💼 **Job Management**
  - Post and manage jobs
  - Search and filter jobs
  - Apply for jobs with proposals
  - Track job status and progress

- 👥 **User Profiles**
  - Freelancer portfolios
  - Client profiles
  - Skills and expertise management
  - Work history and reviews

- 💬 **Messaging System**
  - Real-time chat between clients and freelancers
  - File sharing capabilities
  - Message notifications
  - Chat history

- 💰 **Payment System**
  - Secure payment processing
  - Escrow system for safe transactions
  - Payment history and tracking
  - Invoice generation

- 📱 **Responsive Design**
  - Mobile-first approach
  - Modern and clean UI
  - Dark mode support
  - Accessible components

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: NextAuth.js
- **State Management**: React Context + Local Storage
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide Icons
- **Date Handling**: date-fns

## Project Structure

```
assuredgig/
├── src/                  # Source code
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── jobs/        # Job-related pages
│   │   └── profile/     # User profile pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles and Tailwind config
├── public/              # Static assets
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema definition
├── package.json         # Project dependencies
└── .env                 # Environment variables
```

## Authentication

The application uses NextAuth.js for authentication with the following features:

- Email/Password authentication
- Role-based access control
- Protected routes and API endpoints
- Local storage-based user management
- Session handling and token management

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Job Endpoints

- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs/[id]` - Get job details
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### User Endpoints

- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile
- `GET /api/users/[id]/portfolio` - Get user portfolio
- `POST /api/users/[id]/portfolio` - Update portfolio

## Contributing

We welcome contributions to AssuredGig! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## Deployment

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Vercel account (recommended for deployment)

### Deployment Steps

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Configure environment variables in your deployment platform

4. Set up a custom domain (optional)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@assuredgig.com or join our [Discord community](https://discord.gg/assuredgig).

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 📚 Table of Contents
- [For Beginners](#-for-beginners)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack Explained](#-tech-stack-explained)
- [Getting Started](#-getting-started)
- [Understanding the Codebase](#-understanding-the-codebase)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)

## 🌟 For Beginners

### What is AssuredGig?
AssuredGig is like a digital marketplace where:
- Freelancers can find work and get paid
- Clients can hire talented people for their projects
- Everything happens in a secure, modern web application

### Key Concepts for Beginners

1. **Frontend vs Backend**
   - Frontend: What users see in their browser (pages, buttons, forms)
   - Backend: Server-side code that handles data and business logic

2. **Important Terms**
   - **API**: How frontend and backend communicate
   - **Database**: Where we store all the information
   - **Authentication**: How users log in and stay secure
   - **Component**: Reusable piece of user interface

3. **File Types You'll See**
   - `.tsx`: React components with TypeScript
   - `.ts`: TypeScript files (like JavaScript but with types)
   - `.prisma`: Database schema definition
   - `.env`: Environment variables (configuration)

4. **Basic Workflow**
   ```mermaid
   graph LR
   A[User visits page] --> B[Next.js loads component]
   B --> C[Component fetches data]
   C --> D[Data shown to user]
   ```

### How to Start Learning

1. **First Steps**
   - Look at the `src/app/page.tsx` file (main landing page)
   - Check `src/components` to see reusable parts
   - Read through `prisma/schema.prisma` to understand data structure

2. **What to Learn First**
   - Basic React concepts (components, props, state)
   - TypeScript fundamentals
   - Next.js App Router
   - Tailwind CSS basics

3. **Recommended Learning Path**
   ```
   1. Frontend Basics (React + TypeScript)
   2. Styling (Tailwind CSS)
   3. Backend Concepts (API Routes)
   4. Database (Prisma + MySQL)
   5. Authentication (NextAuth.js)
   ```

## ✨ Features

### For Freelancers
- Create professional portfolios
- Browse and apply for jobs
- Submit detailed proposals
- Track project progress
- Manage contracts and milestones
- Receive secure payments

### For Clients
- Post job opportunities
- Review freelancer profiles
- Manage proposals and contracts
- Track project milestones
- Process payments securely

### Platform Features
- Modern, responsive UI with animations
- Real-time chat functionality
- Secure authentication system
- Payment processing with Stripe
- Meeting scheduling with Cal.com
- Collaborative drawing board with Excalidraw

## 🏗 Project Structure

```
assuredgig/
├── src/                  # Source code
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API routes
│   │   ├── auth/        # Authentication pages
│   │   ├── jobs/        # Job-related pages
│   │   └── profile/     # User profile pages
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles and Tailwind config
├── public/              # Static assets
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema definition
├── package.json         # Project dependencies
└── .env                 # Environment variables
```

## 🛠 Tech Stack Explained

### Core Technologies
1. **Next.js 14**
   - App Router for file-based routing
   - Server Components for improved performance
   - API Routes for backend functionality
   - Server-side rendering and static generation

2. **TypeScript**
   - Type-safe code
   - Better developer experience
   - Enhanced code reliability

3. **Prisma ORM**
   - Type-safe database queries
   - Schema management
   - Database migrations

### Database
- **MySQL**
  - Relational database for structured data
  - Handles complex relationships between entities
  - Used via Prisma ORM

### Authentication
- **NextAuth.js**
  - Secure authentication system
  - JWT-based sessions
  - Role-based access control

### Frontend
1. **Tailwind CSS**
   - Utility-first CSS framework
   - Responsive design
   - Custom design system

2. **Framer Motion**
   - Smooth animations
   - Interactive UI elements
   - Page transitions

3. **Shadcn/UI**
   - Accessible components
   - Customizable design system
   - Dark mode support

### Payment Processing
- **Stripe**
  - Secure payment processing
  - Webhook integration
  - Payment dispute handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- MySQL database
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/assuredgig.git
   cd assuredgig
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Understanding the Codebase

### For Beginners: Common Files Explained

1. **Page Components (`src/app/**/page.tsx`)**
   ```typescript
   // Example of a simple page component
   export default function JobsPage() {
     return (
       <div>
         <h1>Available Jobs</h1>
         {/* Content goes here */}
       </div>
     );
   }
   ```

2. **API Routes (`src/app/api/**/route.ts`)**
   ```typescript
   // Example of a simple API route
   export async function GET() {
     // Get data from database using Prisma
     const jobs = await prisma.job.findMany();
     
     // Return data as JSON
     return Response.json(jobs);
   }
   ```

3. **Components (`src/components/**/*.tsx`)**
   ```typescript
   // Example of a reusable component
   export function JobCard({ title, description }) {
     return (
       <div className="border p-4 rounded">
         <h2>{title}</h2>
         <p>{description}</p>
       </div>
     );
   }
   ```

## 🎯 Quick Start for Beginners

1. **Clone and Setup**
   ```bash
   # Get the code
   git clone https://github.com/yourusername/assuredgig.git
   cd assuredgig

   # Install dependencies
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Open .env and fill in these required values:
   DATABASE_URL="mysql://user:password@localhost:3306/assuredgig"
   NEXTAUTH_SECRET="any-random-string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Start Development**
   ```bash
   # Start the development server
   npm run dev

   # Open your browser and go to:
   # http://localhost:3000
   ```

4. **Make Your First Change**
   - Open `src/app/page.tsx`
   - Make a small change to the text
   - Save the file and see it update instantly

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session

### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details

### Contracts
- `POST /api/contracts` - Create contract
- `GET /api/contracts/:id` - Get contract details
- `PATCH /api/contracts/:id/progress` - Update progress

### Payments
- `POST /api/payments` - Process payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## 🚀 Deployment Guide

### Vercel Deployment

1. **Connect Repository**
   - Fork this repository
   - Connect to Vercel

2. **Environment Setup**
   - Configure environment variables
   - Set up database connection

3. **Deploy**
   - Trigger deployment
   - Run database migrations

### Required Environment Variables
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)

## 🚀 MVP Features

### 1. Job Posting System (Client)
- Create detailed job postings with requirements and budget
- Job categories and skills tagging
- Job status management (Open, In Progress, Completed)
- Integration: Prisma + MySQL for data management

### 2. Portfolio Management (Freelancer)
- Portfolio creation with project showcases
- Skills and expertise listing
- Work samples upload
- Integration: AWS S3/Cloudinary for file storage

### 3. Communication Hub
- Real-time chat using Socket.io
- Video meetings integration
- Meeting scheduler with calendar integration
- Integrations:
  - Cal.com for scheduling
  - Socket.io for real-time chat
  - Daily.co/Whereby for video calls (iframe integration)

### 4. Secure Payment System
- Escrow payment system
- Milestone-based payments
- Payment release upon work approval
- Integration: Razorpay for payment processing

### 5. Project Dashboard
- Real-time project progress tracking
- Milestone visualization
- Task management
- Collaborative workspace with Excalidraw
- Integrations:
  - Excalidraw for visual collaboration
  - Socket.io for real-time updates

## 🔒 Authentication & Security
- Next-Auth for secure authentication
- Role-based access control (Client/Freelancer)
- OAuth providers (Google, GitHub)

## 🛠️ Tech Stack
- Frontend: Next.js 14 with App Router
- Backend: Next.js API Routes
- Database: MySQL with Prisma ORM
- Real-time: Socket.io
- Authentication: Next-Auth
- Payment: Razorpay
- File Storage: AWS S3/Cloudinary
- UI: Tailwind CSS + Shadcn/ui

## 📋 Implementation Timeline
1. Week 1: Auth & User Management
2. Week 2: Job Posting & Portfolio System
3. Week 3: Communication Features
4. Week 4: Payment Integration
5. Week 5: Project Dashboard & Real-time Features

## 🔄 Development Status
- [ ] Authentication System
- [ ] Job Posting
- [ ] Portfolio Management
- [ ] Chat System
- [ ] Video Meetings
- [ ] Payment Integration
- [ ] Project Dashboard
- [ ] Real-time Updates
