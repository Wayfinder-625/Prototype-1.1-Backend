# Google OAuth Setup Guide

This guide explains how to set up and use Google OAuth authentication in your NestJS backend.

## 🚀 What's Been Implemented

### Backend Features
- ✅ Google OAuth 2.0 authentication using Passport
- ✅ Automatic user creation/login with Google profile data
- ✅ Profile completion flow for missing fields (dateOfBirth, gender, location)
- ✅ JWT token generation for authenticated users
- ✅ Integration with existing user table

### API Endpoints

#### 1. Google OAuth Flow
- `GET /auth/google` - Initiates Google OAuth flow (redirects to Google)
- `GET /auth/google/callback` - Handles Google OAuth callback

#### 2. Profile Management
- `POST /auth/complete-profile` - Complete user profile with missing fields
  - Requires JWT authentication
  - Accepts: `dateOfBirth`, `gender`, `location`

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API or People API
4. Go to "APIs & Services" → "Credentials"
5. Click "Create Credentials" → "OAuth client ID"
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
8. Note down your **Client ID** and **Client Secret**

### 2. Environment Variables

Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 3. Frontend Integration

#### Basic Google Sign-In Button
```javascript
// Redirect to Google OAuth
const handleGoogleSignIn = () => {
  window.location.href = 'http://localhost:3000/auth/google';
};
```

#### Handle OAuth Callback
The callback will return a response like:
```json
{
  "message": "Google login successful",
  "user": {
    "email": "user@gmail.com",
    "user_id": 123,
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "requiresProfileCompletion": true,
  "missingFields": ["dateOfBirth", "gender", "location"]
}
```

#### Profile Completion Form
If `requiresProfileCompletion` is true, show a form:
```javascript
const completeProfile = async (profileData) => {
  const response = await fetch('/auth/complete-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      location: 'New York'
    })
  });
  
  const result = await response.json();
  // Handle successful profile completion
};
```

## 🔄 Authentication Flow

### 1. User clicks "Sign in with Google"
- Frontend redirects to `/auth/google`
- Backend redirects to Google OAuth

### 2. User authenticates with Google
- Google redirects back to `/auth/google/callback`
- Backend processes Google response

### 3. Backend creates/updates user
- If user exists (by email): logs them in
- If new user: creates account with Google data
- Checks for missing profile fields

### 4. Response to frontend
- If profile complete: returns tokens and user data
- If profile incomplete: returns missing fields list

### 5. Profile completion (if needed)
- Frontend shows form for missing fields
- User submits to `/auth/complete-profile`
- Backend updates user profile

## 📊 User Data Handling

### From Google (Automatic)
- ✅ Email
- ✅ First Name
- ✅ Last Name
- ✅ Profile Picture URL
- ✅ Email verification status

### From User (Manual completion)
- 📝 Date of Birth
- 📝 Gender
- 📝 Location

## 🛡️ Security Features

- JWT token authentication
- Token refresh mechanism
- Token blacklisting on logout
- Email verification (automatic for Google users)
- Input validation with DTOs

## 🧪 Testing

Run the test script to verify setup:
```bash
node test-google-auth.js
```

## 📝 Notes

- Google users are automatically marked as email verified
- The same user table is used for both email/password and Google users
- Missing profile fields are optional and can be completed later
- All existing authentication features (OTP, JWT, etc.) remain functional

## 🚨 Troubleshooting

### Common Issues
1. **"Invalid redirect URI"** - Check your Google Cloud Console settings
2. **"Client ID not found"** - Verify environment variables
3. **CORS errors** - Ensure CORS is properly configured for your frontend domain

### Debug Mode
Enable debug logging by setting `DEBUG=passport:*` in your environment.

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google Strategy](https://github.com/jaredhanson/passport-google-oauth20)
- [NestJS Passport Documentation](https://docs.nestjs.com/security/authentication) 