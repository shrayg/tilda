# Installation Steps

## Step 1: Create .env File

**Option A: Use the script (Windows)**
```bash
cd backend-node
.\create-env.bat
```

**Option B: Use the script (Mac/Linux)**
```bash
cd backend-node
chmod +x create-env.sh
./create-env.sh
```

**Option C: Create manually**

Create a file named `.env` in the `backend-node` directory with:

```env
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w
DATABASE_URL=file:./dev.db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

## Step 2: Install Dependencies

```bash
cd backend-node
npm install
```

## Step 3: Set Up Database

```bash
cd backend-node
npx prisma generate
npx prisma migrate dev --name init
```

## Step 4: Build

```bash
cd backend-node
npm run build
```

## Step 5: Start Server

```bash
npm run dev
```

Or use the full setup script:

```bash
.\setup.bat
```

## Verify Installation

1. Check `.env` file exists: `dir .env` (Windows) or `ls .env` (Mac/Linux)
2. Check database file created: `dir dev.db` (Windows) or `ls dev.db` (Mac/Linux)
3. Visit http://localhost:5000/health

If you see `{"status":"healthy"}`, you're good to go!

