# 🚀 LeadFlow CRM

> A modern, production-ready Lead Management System built for sales teams.

![LeadFlow CRM Banner](https://img.shields.io/badge/LeadFlow-CRM-0ea5e9?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Overview

LeadFlow CRM is a full-stack lead management system that helps sales teams capture, track, and convert leads efficiently. Built with a React frontend, Express backend, and PostgreSQL database — designed to look and feel like a real SaaS product.

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Register, login, protected routes
- 📊 **Dashboard Analytics** — Live stats, charts (area, bar, pie), conversion rates
- 👤 **Lead Management** — Full CRUD operations with modal-based UX
- 🔍 **Search & Filters** — Debounced search by name/phone/email, filter by status & source
- 📄 **Pagination & Sorting** — Client-controlled pagination with column sorting
- 📥 **CSV Export** — One-click export of filtered leads
- 🌙 **Dark Mode** — System-aware with manual toggle

### Technical
- MVC architecture (Express)
- Sequelize ORM with PostgreSQL
- Rate limiting, CORS, Helmet security
- Input validation (express-validator + frontend)
- Duplicate phone detection
- Debounced API calls (optimized)
- Responsive mobile-first design
- Toast notifications for all actions
- Skeleton loading states
- Empty states with CTAs

---

## 🛠 Tech Stack

| Layer      | Technology                                     |
|------------|------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6  |
| State      | Context API + Custom Hooks                     |
| Charts     | Recharts                                       |
| Backend    | Node.js, Express.js                            |
| ORM        | Sequelize v6                                   |
| Database   | PostgreSQL                                     |
| Auth       | JWT + bcryptjs                                 |
| HTTP       | Axios                                          |
| Security   | Helmet, express-rate-limit, CORS               |
| Validation | express-validator                              |
| Fonts      | Sora (display), JetBrains Mono (code)          |

---

## 📁 Folder Structure

```
leadflow/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # StatusBadge, StatCard, Skeleton, EmptyState
│   │   │   └── modals/      # LeadModal, ConfirmModal
│   │   ├── pages/           # DashboardPage, LeadsPage, LoginPage, RegisterPage
│   │   ├── layouts/         # AppLayout (sidebar + topbar)
│   │   ├── hooks/           # useLeads (CRUD + debounce)
│   │   ├── services/        # api.js (Axios instance + services)
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── utils/           # helpers, constants
│   │   └── routes/          # ProtectedRoute
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── controllers/         # authController, leadController, dashboardController
    ├── routes/              # auth.js, leads.js, dashboard.js
    ├── models/              # User.js, Lead.js (Sequelize)
    ├── middleware/          # auth.js, errorHandler.js
    ├── config/              # database.js
    ├── validators/          # index.js
    ├── utils/               # asyncHandler.js
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or use Neon/Supabase cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/leadflow-crm.git
cd leadflow-crm
```

### 2. Backend setup
```bash
cd server
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, etc.

npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../client
npm install

cp .env.example .env
# Edit VITE_API_URL if needed (defaults to /api via Vite proxy)

npm run dev
# App runs on http://localhost:5173
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/leadflow_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Description         | Auth |
|--------|---------------------|---------------------|------|
| POST   | `/api/auth/register`| Register new user   | ❌   |
| POST   | `/api/auth/login`   | Login               | ❌   |
| GET    | `/api/auth/me`      | Get current user    | ✅   |

### Leads
| Method | Endpoint                   | Description           | Auth |
|--------|----------------------------|-----------------------|------|
| GET    | `/api/leads`               | List leads (paginated)| ✅   |
| POST   | `/api/leads`               | Create lead           | ✅   |
| GET    | `/api/leads/:id`           | Get lead by ID        | ✅   |
| PUT    | `/api/leads/:id`           | Update lead           | ✅   |
| PATCH  | `/api/leads/:id/status`    | Update status only    | ✅   |
| DELETE | `/api/leads/:id`           | Delete lead           | ✅   |

**Query Parameters (GET /api/leads):**
```
?search=john&status=Interested&source=Call&page=1&limit=10&sortBy=createdAt&sortOrder=DESC
```

### Dashboard
| Method | Endpoint               | Description      | Auth |
|--------|------------------------|------------------|------|
| GET    | `/api/dashboard/stats` | All stats + charts data | ✅   |

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(255) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  role      ENUM('admin', 'agent') DEFAULT 'agent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(150) NOT NULL,
  phone             VARCHAR(20) UNIQUE NOT NULL,
  email             VARCHAR(255),
  source            ENUM('Call','WhatsApp','Field','Website','Referral') NOT NULL,
  status            ENUM('New','Interested','Not Interested','Converted','Follow Up') DEFAULT 'New',
  notes             TEXT,
  assigned_to       UUID REFERENCES users(id),
  last_contacted_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

---

## ☁️ Deployment

### Database → Neon PostgreSQL (free tier)
1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy the connection string: `postgresql://user:pass@host.neon.tech/leadflow`
3. Add to `DATABASE_URL` in server env

### Backend → Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root to `server/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `server/.env`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → Import repo
2. Set root directory to `client/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`

---

## 📤 Git Push Commands

```bash
git init
git add .
git commit -m "feat: initial LeadFlow CRM implementation"
git branch -M main
git remote add origin https://github.com/yourusername/leadflow-crm.git
git push -u origin main
```

---

## 🔮 Future Improvements

- [ ] Lead activity timeline / audit log
- [ ] Email integration (send emails from CRM)
- [ ] Role-based permissions (admin vs agent view)
- [ ] Kanban board view for leads
- [ ] Bulk import via CSV
- [ ] WhatsApp integration for messaging
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time updates
- [ ] Advanced analytics with date range picker
- [ ] Pipeline stages with drag-and-drop

---

## 👨‍💻 Author

Built as an internship assignment demonstrating full-stack development with modern tooling, clean architecture, and production-ready standards.

---

## 📄 License

MIT
