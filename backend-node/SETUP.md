# Quick Setup Guide

## 1. Install Dependencies

From the `backend-node` directory:

```bash
cd backend-node
npm install
```

## 2. Set Up Environment Variables

Create a `.env` file in `backend-node` directory with:

```env
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

## 3. Set Up Database

```bash
cd backend-node
npx prisma generate
npx prisma migrate dev --name init
```

## 4. Run Locally

```bash
npm run dev
```

Or:

```bash
npm start
```

Server will run on `http://localhost:5000`

## 5. Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then set environment variables in Vercel dashboard
```

See `DEPLOY.md` for detailed deployment instructions.

## Troubleshooting

### Prisma not found
```bash
npm install -D prisma
npm install @prisma/client
```

### Database errors
```bash
npx prisma generate
npx prisma migrate dev
```

### Port already in use
Change `PORT` in `.env` to a different port (e.g., `5001`)

## Next Steps

1. Update frontend `.env` to point to backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. Test the API:
   - Health: http://localhost:5000/health
   - Docs: http://localhost:5000/docs (if added)

3. Deploy to Vercel (see `DEPLOY.md`)

