# Quick Start Guide

## Step 1: Create .env File

Create a file named `.env` in the `backend-node` directory with this content:

```env
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

## Step 2: Run Setup Script

**Windows:**
```bash
cd backend-node
.\setup.bat
```

**Mac/Linux:**
```bash
cd backend-node
chmod +x setup.sh
./setup.sh
```

**Or manually:**
```bash
cd backend-node
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Step 3: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Test It

Open your browser and visit:
- Health check: http://localhost:5000/health
- API root: http://localhost:5000/

## Troubleshooting

If you get errors about missing modules:
```bash
npm install
```

If Prisma errors:
```bash
npx prisma generate
npx prisma migrate dev
```

