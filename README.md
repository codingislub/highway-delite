# Highway Experiences — Fullstack Booking App

A full end-to-end web app where users can explore travel experiences, pick available slots, and complete bookings, showcasing a realistic full-stack workflow.

## Stack

- Frontend: React + TypeScript (Vite), TailwindCSS, React Router, Axios
- Backend: Node.js + Express (TypeScript)
- Database: MongoDB (Mongoose)
- Hosting: Vercel (frontend), Render/Railway (backend) — instructions below

## Features

- Home: browse experiences with images, price, rating, and capacity
- Details: experience info, date/slot availability, sold-out states
- Checkout: user details, people count, promo codes (SAVE10, FLAT100), price summary
- Result: booking confirmation with ID, or failure message
- API: `/experiences`, `/experiences/:id`, `/bookings`, `/promo/validate`, `/health`
- Double-booking prevention via atomic capacity decrement

---

## Monorepo structure

```
backend/      # Express + MongoDB API (TypeScript)
frontend/     # Vite + React + Tailwind (TypeScript)
```

---

## Quickstart (local)

Prereqs: Node 18+ and a MongoDB connection string (Atlas is fine).

1) Backend

- Copy env template and set values

```powershell
Copy-Item backend/.env.example backend/.env
# Edit backend/.env to set MONGODB_URI and CORS_ORIGIN
```

- Install and run backend

```powershell
cd backend
npm install
npm run dev
```

- (Optional) Seed sample data

```powershell
npm run seed
```

The API listens on http://localhost:4000 by default.

2) Frontend

- Copy env template and set API URL

```powershell
Copy-Item frontend/.env.example frontend/.env
# VITE_API_URL=http://localhost:4000
```

- Install and run frontend

```powershell
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5173.

---

## Environment variables

backend/.env

- `PORT=4000`
- `MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority`
- `CORS_ORIGIN=http://localhost:5173` (comma-separated for multiple origins)

frontend/.env

- `VITE_API_URL=http://localhost:4000`

---

## API Contract (minimal)

- `GET /experiences` → `{ data: ExperienceSummary[] }`
- `GET /experiences/:id` → `{ data: Experience }`
- `POST /promo/validate` → body: `{ code: string }` → `{ data: { valid, type, value } }`
- `POST /bookings` → body: `{ name, email, experienceId, slotId, peopleCount, promoCode? }` → `{ data: { bookingId, finalAmount, experienceTitle, date, timeslot } }`

Notes:
- Double-booking is prevented by atomic `$inc` of slot capacity only if `capacity >= peopleCount`.
- Promo codes: `SAVE10` (10% off) and `FLAT100` (flat 100 off).

---

## Deployment

### Backend (Render or Railway)

- Create a new service from the `backend` folder/repo
- Environment
  - `MONGODB_URI` → your Atlas URI
  - `CORS_ORIGIN` → your frontend domain (e.g., `https://your-frontend.vercel.app`)
  - `PORT` → Render provides; ensure server reads from `process.env.PORT`
- Build & Start commands
  - Build: `npm install && npm run build`
  - Start: `npm run start`
- Seed (optional): run `npm run seed` one-off task after deploy

### Frontend (Vercel)

- Create a Vercel project from the `frontend` folder/repo
- Set Environment Variable `VITE_API_URL` to your backend URL (Render/Railway) and set to Production/Preview
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`

After deploy, confirm the flow: Home → Details → Checkout → Result.

---

## Design & UX

- Responsive layout with Tailwind utility classes
- Clear states: loading, error, sold-out, disabled actions
- Note: If a Figma spec is provided, typography/spacing/colors can be matched exactly; this build uses a clean default scale due to no Figma provided.

---

## Development notes

- TypeScript strict mode enabled in both apps
- Keep the backend `CORS_ORIGIN` aligned with your dev and prod frontends
- To extend validation, see Zod schemas in controllers

---

## Scripts

Backend
- `npm run dev` — run API in watch mode
- `npm run build` — compile TypeScript
- `npm run start` — run compiled server
- `npm run seed` — populate sample experiences

Frontend
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview prod build locally

---

## License

MIT
# highway-delite
