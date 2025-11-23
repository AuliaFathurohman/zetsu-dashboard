# 🎨 Zetsu Dashboard

Modern, real-time monitoring dashboard untuk Zetsu scraping system. **Pure frontend** yang hit API dari backend zetsu-debug.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-cyan)

## ✨ Features

- 📊 **Real-time Monitoring** - Live statistics dan metrics dengan auto-refresh
- 🎯 **Task Management** - View dan filter tasks by status
- 🌐 **Browser Pool Monitoring** - Track browser instances, proxies, dan accounts
- 📈 **Analytics & Charts** - Visual trends dan performance metrics
- 🔄 **Auto-refresh** - Real-time updates setiap 5-15 detik
- 🎨 **Beautiful UI** - Modern design dengan Shadcn UI components
- 📱 **Responsive** - Works perfectly on desktop, tablet, dan mobile
- ⚡ **Fast** - Optimized performance dengan Next.js App Router

## 🏗️ Architecture

```
┌─────────────────┐
│  Zetsu Dashboard│  (Next.js Frontend - Port 3000)
│  (Frontend)     │
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────┐
│  Backend API    │  (Express Server - Port 3001)
│  (zetsu-debug)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   PostgreSQL    │  (Database)
│   Database      │
└─────────────────┘
```

**Separation of Concerns:**
- **Dashboard (Frontend)**: Pure UI/UX, data visualization, real-time updates
- **Backend (zetsu-debug)**: Business logic, database queries, data processing
- **Database**: Data storage

## 🚀 Quick Start

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ Backend **zetsu-debug** running di `http://localhost:3001`
- ✅ Backend API endpoints sudah di-setup (lihat [BACKEND-SETUP.md](./BACKEND-SETUP.md))

### Installation

```bash
# 1. Navigate to dashboard directory
cd /home/tnahonk12/zetsu-dasboard

# 2. Install dependencies (jika belum)
npm install

# 3. Setup environment variables
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env

# 4. Start dashboard
npm run dev
```

### Access Dashboard

Open browser:
```
http://localhost:3000
```

## 📋 Setup Backend API

⚠️ **IMPORTANT**: Dashboard membutuhkan API endpoints di backend!

Follow guide lengkap di: **[BACKEND-SETUP.md](./BACKEND-SETUP.md)**

**Quick summary:**
1. File `dashboard-api.ts` sudah dibuat di `/home/tnahonk12/zetsu-debug/src/`
2. Add import dan call `setupDashboardAPI(app)` di `node-server.ts`
3. Restart backend server
4. Verify endpoints dengan curl

## 📊 Dashboard Pages

### 🏠 Home Dashboard (`/`)
- **Statistics Cards**: Total tasks, completion rates, active resources
- **Trends Chart**: 7-day task completion trends
- **Recent Tasks**: Latest tasks dengan status
- **Auto-refresh**: Every 5-10 seconds

### 📋 Tasks Page (`/tasks`)
- View all tasks (up to 100 at a time)
- Filter by status (Pending, Processing, Completed, Failed)
- Task details: ID, action, domain, browser, OS, retry count, scrape time
- Real-time updates

### 🌐 Browsers Page (`/browsers`)
- Active browser instances
- Browser port dan status
- Associated node, proxy, dan account
- Number of pages per browser

### 🛡️ Proxies Page (`/proxies`)
- All proxy connections
- Status (Running, Blocked, Idle, Pause)
- Usage count (browsers dan accounts using each proxy)

### 👥 Accounts Page (`/accounts`)
- Shopee account management
- Account status dan country
- Associated proxy dan browser
- Attempt tracking

### 🖥️ Nodes Page (`/nodes`)
- Server/node status (UP/DOWN)
- Browser count per node
- Last update time

## 🎨 Tech Stack

### Frontend (Dashboard)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (zetsu-debug)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Port**: 3001

## 🔌 API Endpoints

Dashboard menggunakan endpoints berikut dari backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Dashboard statistics |
| `/api/tasks` | GET | Tasks list dengan filtering |
| `/api/tasks/trends` | GET | Task trends untuk charts |
| `/api/browsers` | GET | Browser instances |
| `/api/proxies` | GET | Proxy list |
| `/api/accounts` | GET | Account list |
| `/nodes` | GET | Node list |

Lihat [BACKEND-SETUP.md](./BACKEND-SETUP.md) untuk detail setup.

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Untuk production atau remote backend:
```env
NEXT_PUBLIC_BACKEND_URL=http://your-backend-server:3001
```

### Change Port

Dashboard default port: `3000`

Untuk menggunakan port lain:
```bash
PORT=3001 npm run dev
```

### Auto-refresh Intervals

Edit intervals di component files:

**Dashboard Stats** (`components/dashboard-stats.tsx`):
```typescript
const interval = setInterval(fetchStats, 10000) // 10 seconds
```

**Recent Tasks** (`components/recent-tasks.tsx`):
```typescript
const interval = setInterval(fetchTasks, 5000) // 5 seconds
```

## 📁 Project Structure

```
zetsu-dasboard/
├── app/
│   ├── api/              # API proxy routes (forward ke backend)
│   │   ├── stats/        # Statistics endpoint
│   │   ├── tasks/        # Tasks & trends endpoints
│   │   ├── browsers/     # Browsers endpoint
│   │   ├── proxies/      # Proxies endpoint
│   │   ├── accounts/     # Accounts endpoint
│   │   └── nodes/        # Nodes endpoint
│   ├── tasks/            # Tasks page
│   ├── browsers/         # Browsers page
│   ├── proxies/          # Proxies page
│   ├── accounts/         # Accounts page
│   ├── nodes/            # Nodes page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/               # Shadcn UI components
│   ├── dashboard-stats.tsx
│   ├── task-trends-chart.tsx
│   ├── recent-tasks.tsx
│   └── main-nav.tsx
├── lib/
│   ├── api-client.ts     # API client untuk hit backend
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

## 🐛 Troubleshooting

### Error: "Failed to fetch from backend"

**Cause**: Backend tidak running atau endpoints belum di-setup

**Solution**:
1. Pastikan backend running: `lsof -i :3001`
2. Setup backend endpoints: Lihat [BACKEND-SETUP.md](./BACKEND-SETUP.md)
3. Verify `.env` file: `NEXT_PUBLIC_BACKEND_URL=http://localhost:3001`

### No Data Showing in Dashboard

**Cause**: Backend endpoints tidak responding atau database kosong

**Solution**:
1. Test backend endpoints:
   ```bash
   curl http://localhost:3001/api/stats
   curl http://localhost:3001/nodes
   ```
2. Check browser console untuk errors
3. Verify backend logs

### CORS Errors

**Cause**: Backend CORS tidak configured properly

**Solution**: Backend sudah pakai `cors()` middleware. Jika masih ada issue, update di `node-server.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

### Port Already in Use

**Cause**: Port 3000 sudah dipakai

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 📝 Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Features Roadmap

- [ ] Dark mode toggle
- [ ] WebSocket untuk real-time updates yang lebih cepat
- [ ] Task actions (pause, retry, cancel buttons)
- [ ] Advanced filtering & search
- [ ] Export data to CSV/JSON
- [ ] User authentication
- [ ] Alert notifications
- [ ] Custom dashboard widgets
- [ ] Multi-language support (ID/EN)

## 📚 Documentation

- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)** - Setup backend API endpoints (PENTING!)
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[SETUP-INSTRUCTIONS.md](./SETUP-INSTRUCTIONS.md)** - Detailed setup instructions
- **[PROJECT-SUMMARY.md](./PROJECT-SUMMARY.md)** - Project overview

## 💡 Notes

- Dashboard adalah **pure frontend** - tidak ada database connection langsung
- Semua data fetch dari backend API (zetsu-debug)
- Backend harus running dan endpoints sudah di-setup
- Auto-refresh keeps data current tanpa manual reload
- All times displayed in local timezone

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Zetsu scraping system.

---

**Built with ❤️ for efficient Zetsu monitoring**

🚀 Happy Monitoring!
