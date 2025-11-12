# Forgot Password Feature Setup Guide

## Overview
The forgot password feature has been successfully implemented with the following components:

- **Backend API**: Password reset endpoints with email service
- **Frontend Pages**: Forgot password and reset password pages
- **Database**: Password reset tokens table
- **Email Service**: SMTP-based email sending with HTML templates
- **Security**: Rate limiting and token expiration

## Database Setup

Run the following SQL script in your PostgreSQL database to create the required table:

```sql
-- Run this in your database
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_password_reset_tokens_updated_at
    BEFORE UPDATE ON password_reset_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Email Configuration

Update your backend `.env` file with SMTP settings:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@museumbudaya.go.id
```

### SMTP Setup Instructions

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an App Password
   - Use: `SMTP_USER=your-email@gmail.com`
   - Use: `SMTP_PASS=your-app-password`

2. **Other SMTP Providers**:
   - Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` accordingly
   - Ensure TLS/SSL settings match your provider

## API Endpoints

### Request Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Validate Reset Token
```http
GET /api/auth/validate-reset-token/:token
```

### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "new_password": "new-password",
  "confirm_password": "new-password"
}
```

## Frontend Routes

- `/auth/forgot-password` - Request password reset
- `/auth/reset-password/:token` - Reset password with token

## Security Features

1. **Rate Limiting**:
   - Max 3 password reset requests per hour per IP
   - Max 5 login attempts per 15 minutes per IP

2. **Token Security**:
   - 64-character random tokens
   - 1-hour expiration
   - One-time use only
   - Stored securely in database

3. **Email Security**:
   - No user enumeration (same response for valid/invalid emails)
   - Professional HTML email templates
   - Clear security warnings

## Testing the Feature

1. **Navigate to Login Page**: Go to `/auth`
2. **Click "Lupa Password?"**: Below the login form
3. **Enter Email**: Submit your email address
4. **Check Email**: Look for password reset email
5. **Click Reset Link**: Use the link in the email
6. **Set New Password**: Enter and confirm new password
7. **Login**: Use new password to login

## Troubleshooting

### Common Issues

1. **Emails Not Sending**:
   - Check SMTP configuration in `.env`
   - Verify SMTP credentials
   - Check spam folder

2. **Database Errors**:
   - Ensure password_reset_tokens table exists
   - Check database connection

3. **Token Validation Fails**:
   - Token may be expired (1-hour limit)
   - Token may have been used already
   - Check server timezone settings

4. **Rate Limiting**:
   - Wait for rate limit to expire
   - Check IP address restrictions

## Files Created/Modified

### Backend Files
- `backend/src/services/emailService.ts` - Email service
- `backend/src/middleware/rateLimit.ts` - Rate limiting middleware
- `backend/src/controllers/authController.ts` - Updated with password reset methods
- `backend/src/routes/auth.ts` - Updated with new routes
- `backend/.env` - Added SMTP configuration
- `backend/.env.example` - Added SMTP configuration example

### Frontend Files
- `src/pages/ForgotPasswordPage.tsx` - Forgot password page
- `src/pages/ResetPasswordPage.tsx` - Reset password page
- `src/App.tsx` - Added routing for new pages
- `src/pages/AuthPage.tsx` - Added forgot password link
- `src/lib/api-client.ts` - Added password reset API methods

### Database Files
- `database/migrations/006_create_password_reset_tokens.sql` - Migration file
- `database/create_password_reset_tokens.sql` - Manual SQL script

## Next Steps

1. **Configure SMTP**: Update SMTP settings in backend `.env`
2. **Run Database Migration**: Execute the SQL script in your database
3. **Test Feature**: Go through the complete password reset flow
4. **Customize Email**: Update email templates in `emailService.ts` if needed

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the backend server logs for API errors
3. Verify database connection and table structure
4. Test SMTP configuration independently