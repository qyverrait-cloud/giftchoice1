# 🎁 Gift Choice - E-commerce Website

A modern, beautiful e-commerce website for gift shopping built with Next.js, React, and TypeScript.

## ✨ Features

- 🛍️ **Product Catalog** - Browse and search products by category
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🤖 **AI Chatbot** - Gift Buddy chatbot with 3D avatar
- 👨‍💼 **Admin Panel** - Complete admin dashboard for managing products, orders, and more
- 🛒 **Shopping Cart** - Add to cart and checkout functionality
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark Mode** - Theme support

## 🚀 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **3D Graphics:** Three.js, React Three Fiber
- **Animations:** GSAP
- **State Management:** React Context API

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔑 Admin Panel

- **URL:** `/admin/login`
- **Phone:** `97999 64364`
- **Password:** `Yash#9799`

## 🌐 Deployment on Hostinger

### Quick Deploy

1. **Prepare files:**
   ```bash
   .\prepare-hostinger.ps1
   ```

2. **Upload to Hostinger:**
   - Upload contents of `hostinger-deploy/` folder to `public_html`
   - Upload `node_modules/` folder OR run `npm install --production` on server

3. **Create Node.js App:**
   - App Root: `/public_html`
   - Start Command: `node .next/standalone/server.js`
   - Port: `3000`

4. **Start the app** in Hostinger panel

See `HOSTINGER_DEPLOY.md` for complete step-by-step guide.

## 📁 Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and contexts
├── hooks/            # Custom React hooks
├── public/           # Static assets
└── styles/           # Global styles
```

## 📝 Environment Variables

Create `.env.local` (optional for basic setup):

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📖 Documentation

- **Hostinger Deployment:** `HOSTINGER_DEPLOY.md` - Complete deployment guide
- **Quick Deploy Script:** `prepare-hostinger.ps1` - Automated file preparation

## 🎯 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for Gift Choice**
