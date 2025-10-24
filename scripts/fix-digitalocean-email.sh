#!/bin/bash

# Quick fix script for DigitalOcean email issues
# Run this on your DigitalOcean droplet

echo "🔧 DigitalOcean Email Fix Script"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

echo "📋 Checking current email configuration..."

# Check firewall status
echo "🔥 Checking firewall rules..."
ufw status | grep -E "(587|465|25)"

# Open SMTP ports
echo "🔓 Opening SMTP ports..."
ufw allow out 587/tcp
ufw allow out 465/tcp
ufw allow out 25/tcp

# Test SMTP connectivity
echo "🌐 Testing SMTP connectivity..."
timeout 5 bash -c "</dev/tcp/smtp.gmail.com/587" && echo "✅ Port 587 (STARTTLS) is open" || echo "❌ Port 587 is blocked"
timeout 5 bash -c "</dev/tcp/smtp.gmail.com/465" && echo "✅ Port 465 (SSL) is open" || echo "❌ Port 465 is blocked"

# Check DNS resolution
echo "🔍 Testing DNS resolution..."
nslookup smtp.gmail.com > /dev/null && echo "✅ DNS resolution works" || echo "❌ DNS resolution failed"

# Check if nodemailer/SMTP packages are causing issues
echo "📦 Checking for common SMTP issues..."

# Disable email temporarily
echo "⚠️  Temporarily disabling email to ensure booking system works..."
echo ""
echo "Add this to your .env file:"
echo "DISABLE_EMAIL=true"
echo ""

# Recommendations
echo "💡 Recommendations:"
echo "1. Use SendGrid instead of Gmail SMTP:"
echo "   - Sign up at https://sendgrid.com"
echo "   - Get API key"
echo "   - Add to .env: EMAIL_SERVICE=sendgrid"
echo "   - Add to .env: SENDGRID_API_KEY=your_key"
echo ""
echo "2. Or disable email entirely:"
echo "   - Add to .env: DISABLE_EMAIL=true"
echo "   - Customers will still get Google Calendar invites"
echo ""
echo "3. Test your setup:"
echo "   - Visit: http://your-domain.com/api/test-email"
echo "   - Check application logs: pm2 logs your-app"
echo ""

echo "✅ Script completed. Restart your application after updating .env file."