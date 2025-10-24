# DigitalOcean Email Setup Guide

## Common Issues on DigitalOcean Droplets

### 1. **SMTP Port Blocking**

DigitalOcean blocks port 25 by default, but ports 587 and 465 should work.

### 2. **Firewall Configuration**

Make sure your droplet allows outbound SMTP connections:

```bash
# Check if ports are open
sudo ufw status

# Allow outbound SMTP ports
sudo ufw allow out 587
sudo ufw allow out 465
sudo ufw allow out 25

# Reload firewall
sudo ufw reloasudo ufw reloadd
```

### 3. **Test Email Connectivity**

Test SMTP connection from your droplet:

```bash
# Test Gmail SMTP connectivity
telnet smtp.gmail.com 587

# If telnet is not installed
sudo apt update && sudo apt install telnet

# Test with curl
curl -v telnet://smtp.gmail.com:587
```

## Recommended Email Solutions for DigitalOcean

### Option 1: SendGrid (Recommended for Production)

SendGrid works reliably on DigitalOcean:

```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

**Setup Steps:**

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your domain or use single sender verification
3. Create API key with "Mail Send" permissions
4. Add to your .env file

### Option 2: Mailgun

Another reliable option:

```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
FROM_EMAIL=noreply@yourdomain.com
```

### Option 3: AWS SES

If you're using AWS services:

```env
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
FROM_EMAIL=noreply@yourdomain.com
```

## Gmail on DigitalOcean (Troubleshooting)

If you must use Gmail, try these configurations:

### Configuration 1: STARTTLS (Port 587)

```env
SMTP_EMAIL_USER=your-email@gmail.com
SMTP_EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Configuration 2: SSL (Port 465)

```env
SMTP_EMAIL_USER=your-email@gmail.com
SMTP_EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

## Network Diagnostics

### Check DNS Resolution

```bash
nslookup smtp.gmail.com
dig smtp.gmail.com
```

### Check Network Connectivity

```bash
# Test SMTP ports
nc -zv smtp.gmail.com 587
nc -zv smtp.gmail.com 465

# Check routing
traceroute smtp.gmail.com
```

### Check DigitalOcean Firewall

```bash
# List iptables rules
sudo iptables -L

# Check if any rules block SMTP
sudo iptables -L OUTPUT | grep -E "(587|465|25)"
```

## Alternative Solutions

### 1. Use DigitalOcean Managed Email

Consider using DigitalOcean's managed email services or third-party integrations.

### 2. Proxy Through Another Server

Set up an email relay server that handles SMTP connections.

### 3. Use HTTP-based Email APIs

Instead of SMTP, use HTTP APIs:

- SendGrid Web API
- Mailgun API
- AWS SES API

## Testing Your Setup

### 1. Use the Test Endpoint

```bash
# Check email configuration
curl http://your-domain.com/api/test-email

# Send test email
curl -X POST http://your-domain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. Check Application Logs

```bash
# View application logs
pm2 logs your-app-name

# Or if using Docker
docker logs your-container-name
```

## Quick Fix for Production

If email is critical and Gmail isn't working, quickly switch to SendGrid:

1. **Sign up for SendGrid** (free tier available)
2. **Get API key** from SendGrid dashboard
3. **Update environment variables:**
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.your_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   ```
4. **Restart your application**

## Monitoring Email Delivery

### 1. Application Logs

Monitor your application logs for email success/failure messages.

### 2. Email Service Dashboard

Check your email service provider's dashboard for delivery statistics.

### 3. Set Up Alerts

Configure alerts for email delivery failures in your monitoring system.

## Security Considerations

1. **Use App Passwords** for Gmail (never use your main password)
2. **Rotate API Keys** regularly
3. **Monitor for Abuse** - watch for unusual email sending patterns
4. **Set Rate Limits** to prevent spam
5. **Use SPF/DKIM/DMARC** records for better deliverability

## Support

If you continue having issues:

1. Check DigitalOcean community forums
2. Contact DigitalOcean support about SMTP restrictions
3. Consider switching to a dedicated email service provider
