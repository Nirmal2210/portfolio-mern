# Nirmal Chaudhary — Portfolio (MERN)

Your original single-file HTML/CSS/JS portfolio, rebuilt as a React (Vite) frontend
backed by an Express + MongoDB API. Visual design, animations, custom cursor, and
the MediaPipe hand-tracking mode are preserved.

```
portfolio-mern/
├── client/     React + Vite frontend
└── server/     Express + MongoDB API
```

**What's dynamic (in MongoDB) vs static (in React code):**
- **Dynamic:** Works/Projects grid, Contact form submissions (messages)
- **Static:** Hero text, About text, stats, skills — edit directly in the component files
  (`client/src/components/About.jsx`, `Hero.jsx`) if you want to change these

---

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server and run it (`mongod`), or
  - **Atlas** (free, no install): create a cluster at https://www.mongodb.com/cloud/atlas and copy its connection string

## 2. Server setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string (used to sign admin login tokens)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login you'll use for `/admin`

Seed the database with the original 5 projects + your admin account:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

You should see `MongoDB connected` and `API server running on port 5000`.
Check it's alive: open http://localhost:5000/api/health — should return `{"status":"ok"}`.

## 3. Client setup

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 — your portfolio, now fetching Works from MongoDB.

## 4. Admin panel

Go to http://localhost:5173/admin/login and log in with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `server/.env`. From there you can:
- Add / edit / delete project cards (title, year, role, canvas animation type, color, size, order)
- View and manage contact form messages

## 5. Deploying

- **Server**: any Node host (Render, Railway, Fly.io, a VPS). Set the same env vars there,
  point `MONGO_URI` at Atlas, and set `CLIENT_ORIGIN` to your deployed frontend URL.
- **Client**: `npm run build` in `client/` produces `dist/` — deploy to Vercel, Netlify,
  or any static host. Set `VITE_API_URL` to your deployed server's `/api` URL before building.

## Project structure reference

```
server/
  models/       Project.js, Message.js, Admin.js  (Mongoose schemas)
  routes/       projects.js, messages.js, auth.js
  middleware/   auth.js  (JWT check for admin-only routes)
  seed.js       one-time script to populate initial data
  server.js     Express app entry point

client/
  src/
    components/ Cursor, Loader, Nav, BgCanvas, Hero, About, Works, WorkCard,
                Contact, Footer, HandMode
    pages/      Home, AdminLogin, AdminDashboard
    api/        client.js (axios instance, auto-attaches admin JWT)
    hooks/      useReveal.js (scroll-reveal animation)
```

## API reference

| Method | Route                    | Auth  | Purpose                        |
|--------|---------------------------|-------|---------------------------------|
| GET    | `/api/projects`           | none  | List all projects              |
| GET    | `/api/projects/:id`       | none  | Get one project                |
| POST   | `/api/projects`           | admin | Create project                 |
| PUT    | `/api/projects/:id`       | admin | Update project                 |
| DELETE | `/api/projects/:id`       | admin | Delete project                 |
| POST   | `/api/messages`           | none  | Submit contact form            |
| GET    | `/api/messages`           | admin | List messages                  |
| PATCH  | `/api/messages/:id/read`  | admin | Mark message as read           |
| DELETE | `/api/messages/:id`       | admin | Delete message                 |
| POST   | `/api/auth/login`         | none  | Admin login → returns JWT      |
