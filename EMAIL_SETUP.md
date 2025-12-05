# Email Setup Guide

## Current Implementation

The membership form currently logs email content to the console. To enable actual email sending to `president@shosh.org.za`, you need to set up a backend API.

## Recommended Setup Options

### Option 1: Using EmailJS (Client-side, Quick Setup)
1. Sign up at https://www.emailjs.com/
2. Create an email service
3. Create an email template
4. Install: `npm install @emailjs/browser`
5. Update the `sendEmailToPresident` function to use EmailJS

### Option 2: Using a Backend API (Recommended for Production)
1. Create a backend API endpoint (Node.js/Express example):
```javascript
app.post('/api/send-membership', async (req, res) => {
  const { formData, membershipNumber, emailHTML } = req.body;
  
  // Using nodemailer
  const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host',
    port: 587,
    secure: false,
    auth: {
      user: 'your-email@domain.com',
      pass: 'your-password'
    }
  });

  await transporter.sendMail({
    from: 'noreply@shosh.org.za',
    to: 'president@shosh.org.za',
    subject: `New Membership Application - ${membershipNumber}`,
    html: emailHTML
  });

  res.json({ success: true });
});
```

2. Update `sendEmailToPresident` in Join.tsx:
```typescript
const sendEmailToPresident = async (membershipNum: string) => {
  const emailHTML = generateEmailHTML(membershipNum);
  
  const response = await fetch('/api/send-membership', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formData, membershipNumber: membershipNum, emailHTML })
  });

  return response.json();
};
```

### Option 3: Using Serverless Functions (Vercel/Netlify)
Create an API route that handles email sending using services like SendGrid, AWS SES, or Resend.

## Email Template

The form generates a beautifully formatted HTML email with:
- Professional header with party branding
- Membership number prominently displayed
- All form fields organized in sections
- Digital signature embedded as image
- Responsive design for mobile viewing

## Testing

Currently, the email HTML is logged to the browser console. You can:
1. Open browser DevTools (F12)
2. Submit a membership form
3. Copy the HTML from console
4. Save as .html file to preview the email

## Security Notes

- Never expose SMTP credentials in frontend code
- Always use environment variables for sensitive data
- Implement rate limiting on the backend
- Validate and sanitize all form inputs
- Use HTTPS for all API calls
