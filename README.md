# AssuredGig - Modern Freelance Platform

AssuredGig is a comprehensive freelance marketplace built with Next.js 14, designed to connect clients with talented freelancers in a secure and efficient environment.

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
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── jobs/         # Job-related endpoints
│   │   │   ├── contracts/    # Contract management
│   │   │   └── payments/     # Payment processing
│   │   ├── (routes)/         # Page components
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── jobs/            # Job-related components
│   │   ├── contracts/       # Contract components
│   │   └── portfolio/       # Portfolio components
│   ├── lib/                 # Utility functions and configs
│   │   ├── auth.config.ts   # NextAuth configuration
│   │   ├── db.ts           # Database client
│   │   └── utils.ts        # Helper functions
│   └── types/              # TypeScript type definitions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/        # Database migrations
└── public/               # Static assets
```

## 🛠 Tech Stack Explained

### Core Technologies
1. **Next.js 14**
   - App Router for file-based routing
   - Server Components for improved performance
   - API Routes for backend functionality

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

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/assuredgig.git
   cd assuredgig
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Required variables:
   DATABASE_URL="mysql://user:password@localhost:3306/assuredgig"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate
   ```

5. **Start Development Server**
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
     // Get data from database
     const jobs = await db.job.findMany();
     
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

### Common Code Patterns Explained

1. **Fetching Data**
   ```typescript
   // How to get data from the API
   async function getJobs() {
     const response = await fetch('/api/jobs');
     const data = await response.json();
     return data;
   }
   ```

2. **Using Components**
   ```typescript
   // How to use components in pages
   import { JobCard } from '@/components/JobCard';

   export default function JobsPage() {
     return (
       <div>
         <JobCard 
           title="Web Developer Needed"
           description="Looking for React expert..."
         />
       </div>
     );
   }
   ```

3. **Form Handling**
   ```typescript
   // Example of a simple form
   export function JobForm() {
     const handleSubmit = (e) => {
       e.preventDefault();
       // Handle form submission
     };

     return (
       <form onSubmit={handleSubmit}>
         <input type="text" placeholder="Job Title" />
         <button type="submit">Create Job</button>
       </form>
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