# Echoes

A complete replication of the ForeverMissed memorial website built with Next.js, TypeScript, and Tailwind CSS. Create beautiful online memorial websites to honor your loved ones and share memories with family and friends.

![Echoes](https://via.placeholder.com/800x400/f3f4f6/374151?text=ForeverMissed+Clone)

## 🌟 Features

- ✅ **User Authentication** - Secure registration and login system
- ✅ **Memorial Creation** - Multi-step form with photo uploads
- ✅ **Beautiful Themes** - 10+ customizable memorial themes
- ✅ **Photo Galleries** - Upload and organize memorial photos
- ✅ **Tribute System** - Family and friends can leave messages
- ✅ **Privacy Controls** - Public, private, or invite-only memorials
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Timeline Events** - Create life milestone timelines
- ✅ **Search & Discovery** - Browse public memorial gallery
- ✅ **Social Sharing** - Share memorial pages with others

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **File Storage**: Cloudinary for image uploads
- **UI Components**: Custom components with Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom themes

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.17 or later)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

### Optional Services (for full functionality):
- **Cloudinary** account (for image uploads)
- **SMTP Email** service (for notifications)
- **Stripe** account (for payments - optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/forevermissed-clone.git
cd forevermissed-clone
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install

# Or if you prefer yarn
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/forevermissed"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"
JWT_SECRET="your-jwt-secret-key-here"

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (for notifications - optional)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Stripe (for payments - optional)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Set Up the Database

#### Option A: Local PostgreSQL

1. **Install PostgreSQL** on your machine
2. **Create a database**:
   ```sql
   CREATE DATABASE echoes;
   ```
3. **Update DATABASE_URL** in `.env.local` with your credentials

#### Option B: Cloud Database (Recommended)

Use a cloud PostgreSQL service like:
- **Supabase** (free tier available)
- **Railway** (free tier available)
- **PlanetScale** (MySQL alternative)
- **Neon** (PostgreSQL with free tier)

### 5. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 6. Set Up Cloudinary (Image Storage)

1. **Create a free Cloudinary account** at [cloudinary.com](https://cloudinary.com)
2. **Get your credentials** from the dashboard
3. **Add them to `.env.local`**

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
forevermissed-clone/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── create/            # Memorial creation
│   │   ├── memorial/          # Memorial display pages
│   │   └── gallery/           # Public gallery
│   ├── components/            # React components
│   │   ├── ui/                # Basic UI components
│   │   ├── layout/            # Layout components
│   │   ├── memorial/          # Memorial-specific components
│   │   ├── forms/             # Form components
│   │   └── auth/              # Authentication components
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React contexts
│   └── styles/                # Global styles
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🔧 Configuration

### Database Schema

The project uses Prisma ORM with the following main models:
- **User** - User accounts and authentication
- **Memorial** - Memorial pages and settings
- **Photo** - Memorial photos and galleries
- **Tribute** - Messages and tributes from visitors
- **TimelineEvent** - Life milestone events
- **Invitation** - Collaboration invitations

### Authentication

The app uses JWT-based authentication with:
- Secure password hashing (bcryptjs)
- Protected API routes
- Client-side auth context
- Automatic token refresh

### File Uploads

Images are handled through:
- Cloudinary for storage and optimization
- React Dropzone for user-friendly uploads
- Automatic image resizing and compression
- CDN delivery for fast loading

## 🎨 Customization

### Adding New Themes

1. **Add theme to Prisma schema** (`prisma/schema.prisma`):
   ```prisma
   enum MemorialTheme {
     // ... existing themes
     YOUR_NEW_THEME
   }
   ```

2. **Add theme styles** (`src/styles/themes.css`):
   ```css
   .memorial-theme-your-new-theme {
     @apply bg-gradient-to-br from-your-color-50 to-your-color-100;
   }
   ```

3. **Update theme options** in components

### Customizing UI Components

All UI components are in `src/components/ui/` and can be customized:
- **Button.tsx** - Button variants and styles
- **Input.tsx** - Form input components
- **Card.tsx** - Card layouts and containers

## 📱 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy!**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Upload the `.next` folder** to Netlify
3. **Configure environment variables**

### Deploy to Railway

1. **Connect your GitHub repository**
2. **Add environment variables**
3. **Deploy with one click**

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📊 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run database migrations
npm run db:push         # Push schema to database
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database with sample data

# Utilities
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Module not found: Can't resolve '@/lib/auth'"

**Solution**: Ensure TypeScript path mapping is configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 2. Database Connection Issues

**Solutions**:
- Check your `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database credentials
- Try running `npx prisma db push`

#### 3. Cloudinary Upload Errors

**Solutions**:
- Verify Cloudinary credentials
- Check API key permissions
- Ensure upload presets are configured

#### 4. Build Errors

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

### Getting Help

If you encounter issues:

1. **Check the console** for error messages
2. **Review the logs** in your terminal
3. **Search existing issues** on GitHub
4. **Create a new issue** with detailed information

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original ForeverMissed.com
- Built with amazing open-source tools
- Thanks to the Next.js and React communities

## 📞 Support

For support and questions:

- **Email**: support@yourproject.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/forevermissed-clone/issues)
- **Documentation**: [Full documentation](https://yourproject.com/docs)

---

**Made with ❤️ for families everywhere**

Remember to honor and celebrate the lives of those we've lost. Every memory shared keeps their spirit alive.