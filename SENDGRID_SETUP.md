# SendGrid Email Setup - Quick Guide

## ✅ Your SendGrid Configuration

Based on your SendGrid setup, here's what you need to do:

### 1. Add to your .env file:

```env
# SendGrid Configuration (PRIORITY)
SENDGRID_API_KEY=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
FROM_EMAIL=bookings@ignitionautocare.com

# Optional: Disable Gmail fallback if you want SendGrid only
# SMTP_EMAIL_USER=
# SMTP_EMAIL_PASS=
```

### 2. Restart your application:

```bash
# If using PM2
pm2 restart your-app-name

# If using Docker
docker restart your-container-name

# If running directly
npm run dev
```

### 3. Test your email setup:

#### Option A: API Test (Recommended)
```bash
# Check email service health
curl http://your-domain.com/api/test-email

# Send test email
curl -X POST http://your-domain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

#### Option B: Browser Test
Visit: `http://your-domain.com/api/test-email` in your browser

### 4. Verify SendGrid Settings

Your SendGrid configuration:
- **Server:** smtp.sendgrid.net
- **Port:** 587 (STARTTLS)
- **Username:** apikey (literally the word "apikey")
- **Password:** Your API key (SG.R3bTv...)

## 🔧 How It Works

The system now prioritizes email services in this order:

1. **SendGrid** (if SENDGRID_API_KEY is set) ← **YOUR SETUP**
2. **Gmail SMTP** (if SMTP_EMAIL_USER/PASS are set) ← Fallback
3. **Skip email** (if DISABLE_EMAIL=true)

## 🚀 Production Checklist

- [x] SendGrid API key configured
- [ ] FROM_EMAIL set to your domain
- [ ] Test email sent successfully
- [ ] Application restarted
- [ ] Booking confirmation emails working

## 📧 Email Features

With SendGrid configured, your app will:

✅ Send booking confirmation emails
✅ Send booking reminder emails  
✅ Handle email failures gracefully
✅ Log email delivery status
✅ Use professional email templates

## 🔍 Troubleshooting

### If emails aren't sending:

1. **Check logs:**
   ```bash
   pm2 logs your-app-name
   # Look for "📧 Using SendGrid for email delivery"
   ```

2. **Verify API key:**
   - Make sure it starts with `SG.`
   - Check it has "Mail Send" permissions in SendGrid

3. **Test API endpoint:**
   ```bash
   curl http://your-domain.com/api/test-email
   ```

4. **Check SendGrid dashboard:**
   - Go to SendGrid → Activity
   - Look for sent emails and delivery status

### Common Issues:

- **"Authentication failed"** → Check API key is correct
- **"From email not verified"** → Verify sender in SendGrid dashboard
- **"Connection timeout"** → Check firewall/network settings

## 📊 Monitoring

Monitor email delivery in:
- SendGrid Dashboard → Activity
- Your application logs
- Email bounce/spam reports

## 🎯 Next Steps

1. Add your API key to .env
2. Restart your app
3. Test with the API endpoint
4. Try a real booking to confirm emails work
5. Monitor SendGrid dashboard for delivery stats

**Your email service should now be working with SendGrid!** 🎉