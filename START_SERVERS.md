# How to Start Both Servers

## Option 1: Start Both at Once (Recommended)

From the project root, run:
```bash
.\start-all.bat
```

This will:
1. Start the backend in a new window
2. Wait 3 seconds
3. Start the frontend in another new window

Both servers will run in separate windows.

---

## Option 2: Start Separately

### Start Backend:
```bash
cd backend-node
.\start.bat
```

Backend will run on: **http://localhost:5000**

### Start Frontend (in a new terminal):
```bash
npm run dev
```

Frontend will run on: **http://localhost:8080**

---

## What the Scripts Do

### `start-all.bat` (Project Root)
- Opens backend in new window
- Opens frontend in new window
- Both run simultaneously

### `backend-node/start.bat`
- Creates `.env` file if missing
- Sets up database if needed
- Builds TypeScript
- Starts backend server

### `start-frontend.bat` (Project Root)
- Starts frontend dev server

---

## Verify Everything Works

1. **Backend Health Check**: http://localhost:5000/health
   - Should return: `{"status":"healthy"}`

2. **Frontend**: http://localhost:8080
   - Should show the map interface

3. **Test Route Generation**: 
   - Enter origin and destination
   - Routes should appear with safety ratings

---

## Troubleshooting

### Backend won't start
1. Check `.env` exists in `backend-node/` directory
2. Run: `cd backend-node && npx prisma migrate dev --name init`
3. Check for TypeScript errors: `npm run build`

### Frontend won't start
1. Make sure `.env` exists in project root
2. Check `VITE_API_URL=http://localhost:5000`
3. Check `VITE_MAPBOX_TOKEN` is set

### Database errors
```bash
cd backend-node
npx prisma generate
npx prisma migrate dev --name init
```

### Port already in use
- Backend: Change `PORT=5000` to `PORT=5001` in `backend-node/.env`
- Frontend: Vite will automatically use next available port

