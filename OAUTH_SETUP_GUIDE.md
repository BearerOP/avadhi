# OAuth 2.0 Authentication Setup Guide

## 🎉 Authentication System Complete!

I've successfully implemented a complete OAuth 2.0 authentication system with Google and GitHub providers. Here's what has been set up:

## 📋 What's Been Implemented

### ✅ Database Schema
- Updated Prisma schema with NextAuth models (User, Account, Session, VerificationToken)
- Added OAuth fields to User model (provider, providerId, image)
- Made password optional for OAuth users

### ✅ Frontend (Next.js)
- NextAuth.js configuration with Google and GitHub providers
- API routes for authentication (`/api/auth/[...nextauth]`)
- Authentication context and session provider
- Updated SignInModal with real OAuth sign-in
- User profile component with sign-out functionality
- Protected routes component
- Updated Navbar with authentication state
- Dashboard page for authenticated users

### ✅ Backend (Express API)
- NextAuth session validation middleware
- Protected API routes for user profile
- Cookie parser for session handling
- Type definitions for authenticated requests

## 🚀 Setup Instructions

### 1. Environment Variables

Create the following files with your OAuth credentials:

**`apps/web/.env.local`:**
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/avadhi?schema=public
```

### 2. OAuth Provider Setup

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env.local`

#### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Avadhi"
   - Homepage URL: `http://localhost:3001`
   - Authorization callback URL: `http://localhost:3001/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

### 3. Database Migration

Run the database migration to apply the new schema:

```bash
npm run db:migrate
```

### 4. Start the Applications

```bash
# Start the web app
npm run dev:web

# Start the API (in another terminal)
npm run dev:api
```

## 🔧 How It Works

### Authentication Flow
1. User clicks "Sign In" in the navbar
2. SignInModal opens with Google and GitHub options
3. User selects provider and completes OAuth flow
4. NextAuth creates session and user record in database
5. User is redirected back to the app as authenticated
6. Navbar shows user profile with sign-out option

### Protected Routes
- Dashboard page requires authentication
- API routes under `/api/v1/profile/*` require valid session
- Automatic redirect to home if not authenticated

### Session Management
- Database-based sessions (secure for production)
- Automatic session refresh
- Secure cookie handling
- Session expiry management

## 🔐 Security Features

- CSRF protection built into NextAuth
- Secure session cookies
- Database session validation
- Session expiry handling
- Provider account linking prevention

## 🧪 Testing the System

1. Visit `http://localhost:3001`
2. Click "Sign In" in the navbar
3. Choose Google or GitHub
4. Complete OAuth flow
5. You should be redirected back as authenticated
6. Visit `http://localhost:3001/dashboard` to see protected content
7. Test API: `GET http://localhost:8000/api/v1/profile/me` with session cookie

## 📱 API Endpoints

### Protected Endpoints
- `GET /api/v1/profile/me` - Get current user profile
- `PATCH /api/v1/profile/me` - Update user profile

### Public Endpoints (existing)
- `POST /api/v1/user/auth/register` - Register with email/password
- `POST /api/v1/user/auth/login` - Login with email/password

## 🛠 Customization Options

### Adding More Providers
Edit `apps/web/lib/auth.ts` to add providers like:
- Discord
- Twitter
- Apple
- Custom OIDC providers

### Styling
- Update `SignInModal.tsx` for custom OAuth button styling
- Modify `UserProfile.tsx` for user display preferences
- Customize `ProtectedRoute.tsx` loading states

### Session Configuration
- Change session strategy in `auth.ts` (database vs JWT)
- Modify session expiry times
- Add custom session data

## 🚨 Production Considerations

1. **Environment Variables**: Use secure secrets in production
2. **HTTPS**: Ensure all OAuth redirects use HTTPS
3. **Domain Configuration**: Update OAuth apps with production domains
4. **Database**: Use connection pooling for better performance
5. **Rate Limiting**: Add rate limiting to auth endpoints

## 🐛 Troubleshooting

### Common Issues
1. **OAuth redirect URI mismatch**: Check provider configuration
2. **Database connection**: Ensure PostgreSQL is running
3. **Session not persisting**: Check cookie settings and NEXTAUTH_SECRET
4. **CORS issues**: Ensure proper domain configuration

Your authentication system is now fully functional! 🎉