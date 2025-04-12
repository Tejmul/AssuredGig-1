# AssuredGig - Premium Freelance Platform

AssuredGig is a modern freelance platform that connects clients with talented freelancers in a secure and premium environment. Built with Next.js 13, React, and a beautiful dark neon theme.

## Features

- 🎨 Modern, responsive UI with dark neon theme
- 🔐 Secure authentication with NextAuth.js
- 💼 Job posting and bidding system
- 👥 Freelancer profiles with portfolios
- 💰 Secure payment processing with Stripe
- 💬 Real-time messaging with Socket.io
- ⭐ Review and rating system
- 🔍 Advanced search and filtering

## Tech Stack

- **Frontend**:
  - Next.js 13 (App Router)
  - React
  - Tailwind CSS
  - Shadcn/ui
  - Framer Motion

- **Backend**:
  - Node.js
  - Express.js
  - Prisma
  - MySQL

- **Authentication**:
  - NextAuth.js
  - JWT

- **Payment**:
  - Stripe
  - PayPal

- **Real-time**:
  - Socket.io

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database
- Stripe account (for payments)

### Installation

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
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/assuredgig"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_PUBLIC_KEY="your-stripe-public-key"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
assuredgig/
├── src/
│   ├── app/              # Next.js 13 app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   └── store/           # State management
├── prisma/              # Database schema
├── public/              # Static assets
└── package.json         # Dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/) 