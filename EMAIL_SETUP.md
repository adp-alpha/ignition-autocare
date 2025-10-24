# Email Configuration Setup

This guide will help you set up email notifications for booking confirmations.

## Quick Setup Options

### Option 1: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Add to your `.env` file**:
   ```env
   EMAIL_SERVICE=gmail
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   FROM_EMAIL=your-email@gmail.com
   ```

### Option 2: SendGrid (Recommended for production)

1. **Create a SendGrid account** at https://sendgrid.com
2. **Generate an API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
3. **Add to your `.env` file**:
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 3: Custom SMTP

For other email providers (Outlook, custom SMTP servers):

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
FROM_EMAIL=noreply@yourdomain.com
```

## Testing Email Configuration

After setting up your environment variables, you can test the email functionality by creating a booking through your application.

## Customizing Email Content

To customize the email template:

1. **Edit contact information** in `lib/email-service.ts`:
   - Replace `[Your garage address here]` with your actual address
   - Replace `[Your phone number]` with your contact number
   - Replace `[Your email address]` with your support email

2. **Modify email styling** by editing the CSS in the `generateBookingConfirmationHTML` function

## Email Features

- ✅ **Booking Confirmation**: Sent immediately when booking is created
- ✅ **Professional HTML Template**: Mobile-responsive design
- ✅ **Booking Details**: Complete appointment and vehicle information
- ✅ **Fallback Support**: Email sent even if Google Calendar fails
- ✅ **Reminder Emails**: Function available for future cron job integration

## Troubleshooting

### Gmail Issues
- Make sure 2FA is enabled
- Use App Password, not your regular password
- Check "Less secure app access" is disabled (use App Password instead)

### SendGrid Issues
- Verify your sender identity
- Check API key permissions
- Ensure your domain is verified for production use

### General Issues
- Check environment variables are loaded correctly
- Verify SMTP settings with your email provider
- Check spam/junk folders for test emails

## Production Considerations

1. **Use a dedicated email service** (SendGrid, AWS SES, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Use a professional from address** (e.g., bookings@yourdomain.com)
4. **Monitor email delivery rates** and bounce handling
5. **Implement email templates** for different notification types

## Next Steps

- Set up automated reminder emails (24 hours before appointment)
- Add email templates for booking cancellations/modifications
- Implement email tracking and analytics
- Add unsubscribe functionality for marketing emails