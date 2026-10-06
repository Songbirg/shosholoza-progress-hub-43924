# Shosholoza Progressive Party Website

[![Netlify Status](https://img.shields.io/badge/Netlify-Ready-00C7B7?logo=netlify)](https://www.netlify.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, responsive website for the Shosholoza Progressive Party (Shosh), featuring a multi-step membership registration system with digital signatures and PDF generation.

## 🌟 Features

### Multi-Step Membership Form
- **3-Step Registration Process** with animated progress indicator
- **Digital Signature** capture (mouse & touch support)
- **PDF Generation** with complete membership details
- **Email Submission** to president@shosh.org.za
- **Real-time Validation** (ID numbers, phone numbers, required fields)
- **Unique Membership Numbers** auto-generated
- **Responsive Design** for mobile and desktop

### Website Features
- Modern, clean design with party branding
- Responsive navigation
- About page with party information
- Founder profile page
- Values and mission statement
- Contact form
- Interactive timeline
- Location map integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/shosholoza-website.git
cd shosholoza-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to view the site.

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Deploy to Netlify

1. **Via Netlify UI** (Recommended)
   - Push code to GitHub
   - Connect repository to Netlify
   - Deploy automatically

2. **Via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📋 Project Structure

```
shosholoza-website/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Home page
│   │   ├── Join.tsx     # Membership form
│   │   ├── About.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── assets/          # Images and static files
├── public/              # Public assets
├── netlify.toml         # Netlify configuration
└── package.json
```

## 🎨 Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📝 Documentation

- [Membership Form Features](./MEMBERSHIP_FORM_FEATURES.md)
- [Email Setup Guide](./EMAIL_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🔧 Configuration

### Email Setup
The membership form currently logs email content to the console. To enable actual email sending:

1. Set up a backend API (Node.js/Express)
2. Or use EmailJS for client-side email
3. Or use Netlify Functions

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions.

### Environment Variables
Create a `.env` file for any API keys:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

Shosholoza Progressive Party
- Email: president@shosh.org.za
- Website: [Coming Soon]

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Netlify](https://www.netlify.com/)
