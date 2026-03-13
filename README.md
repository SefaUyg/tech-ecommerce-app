# TechShop – E-Commerce Application

> Modern e-commerce app built with Next.js 16, MongoDB, Prisma and Tailwind CSS. Features Turkish/English i18n, dark/light theme, admin panel, and Cloudinary integration.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

## ✨ Features

- **Product catalog** – Product listing, detail page, add to cart
- **Auth** – JWT-based session (httpOnly cookie)
- **Cart & orders** – Cart management, checkout flow, order history
- **Admin panel** – Product CRUD, order management, user management, password reset
- **Cloudinary** – Product image uploads
- **i18n** – Turkish / English
- **Dark / light mode** – Theme switcher (next-themes)
- **Responsive** – Mobile-friendly UI

## 🛠 Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB (Prisma ORM) |
| Styling | Tailwind CSS v4 |
| Auth | JOSE (JWT), bcryptjs |
| i18n | Cookie-based locale |
| Theme | next-themes |
| Images | Cloudinary |
| Validation | Zod |

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── admin/              # Admin panel
│   ├── account/orders/     # Order history
│   ├── api/                # API routes
│   ├── cart/               # Cart
│   ├── checkout/           # Checkout
│   ├── login, register/    # Auth pages
│   └── product/[id]/       # Product detail
├── components/             # React components
├── lib/                    # Auth, Prisma, i18n
└── generated/prisma/       # Prisma Client (from db:generate)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/techshop.git
cd techshop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### 4. Set up the database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection URL |
| `AUTH_JWT_SECRET` | JWT signing key (32+ chars) |
| `ADMIN_EMAIL` | Admin seed email |
| `ADMIN_PASSWORD` | Admin seed password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

To generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📜 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed admin user |

## 🔐 Security

- Session: JWT in httpOnly cookie
- Admin access: Middleware + API checks
- Input validation: Zod
- Upload: MIME type and size checks

## 📄 License

MIT
