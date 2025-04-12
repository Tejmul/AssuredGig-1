# AssuredGig - Freelance Platform

AssuredGig is a modern freelance platform that connects clients with talented freelancers.

## Features

- User authentication with NextAuth.js
- Resume creation and management
- Job posting and browsing
- Proposal submission and management
- Contract and milestone tracking
- Real-time messaging
- Payment processing with Stripe
- Responsive design with Tailwind CSS

## Tech Stack

- Next.js 14
- TypeScript
- Prisma ORM
- MySQL Database
- NextAuth.js
- Stripe
- Tailwind CSS
- Framer Motion

## Deployment on Vercel

### Prerequisites

1. A Vercel account
2. A MySQL database (e.g., PlanetScale, Railway, or any other MySQL provider)
3. OAuth credentials for Google and GitHub
4. Stripe account and API keys
5. Email service provider credentials

### Deployment Steps

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/assuredgig.git
   cd assuredgig
   ```

2. **Set Up Environment Variables**
   - Copy `.env.production.example` to `.env.production`
   - Fill in all the required environment variables with your production values

3. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Import the project
   - Add all environment variables from `.env.production` to Vercel's environment variables section
   - Deploy the project

4. **Database Setup**
   - Run database migrations on your production database:
     ```bash
     npm run db:deploy
     ```

5. **Verify Deployment**
   - Check if the application is running correctly
   - Test authentication, job posting, and other features

### Environment Variables

Make sure to set the following environment variables in Vercel:

- `DATABASE_URL`: Your production database URL
- `NEXTAUTH_SECRET`: A secure random string for NextAuth.js
- `NEXTAUTH_URL`: Your production URL (e.g., https://assuredgig.vercel.app)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth credentials for Google
- `GITHUB_ID` and `GITHUB_SECRET`: OAuth credentials for GitHub
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, and `STRIPE_WEBHOOK_SECRET`: Stripe API keys
- Email server configuration variables

## Development

### Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all the required environment variables

3. **Set Up Database**
   ```bash
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open the Application**
   - Navigate to http://localhost:3000

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/) 