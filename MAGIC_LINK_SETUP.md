# Magic Link Authentication Setup

The magic link authentication is now configured and ready to use.

## Current Status

✅ **Dev Mode (Default)**: Magic links are printed to the backend console
- When you request a magic link, check your backend terminal
- Look for the formatted email output with the clickable link
- Copy and paste the link into your browser

✅ **Production Mode**: Real emails via SMTP
- Configure SMTP credentials in `backend/.env`
- See `backend/.env.example` for configuration options

## How to Enable Real Emails

### Option 1: Gmail (Easiest for testing)

1. **Create a Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

2. **Update `backend/.env`**:
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

3. **Restart the backend**

### Option 2: SendGrid (Recommended for production)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Update `backend/.env`:
   ```env
   SMTP_SERVER=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

### Option 3: Mailgun

1. Sign up at https://www.mailgun.com
2. Get your SMTP credentials
3. Update `backend/.env` accordingly

## Testing the Magic Link

1. Go to `http://localhost:5173`
2. Enter your email address
3. Click "Continuar con Magic Link"
4. **Dev Mode**: Check backend console for the link
5. **Production Mode**: Check your email inbox
6. Click the magic link to authenticate

## For Docker Deployment

Add SMTP credentials to `docker-compose.yml` or use environment variables:

```yaml
backend:
  environment:
    - SMTP_USER=your-email@gmail.com
    - SMTP_PASSWORD=your-app-password
```

Or create a `.env` file in the project root and reference it in docker-compose.
