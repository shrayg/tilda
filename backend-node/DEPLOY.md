# Deploy to Vercel Guide

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Navigate to backend directory**:
```bash
cd backend-node
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel
```

5. **Follow prompts**:
   - Link to existing project? **No** (first time)
   - What's your project's name? **saferoute-backend**
   - In which directory is your code located? **./** (current directory)
   - Want to override settings? **No**

6. **Set Environment Variables**:

After deployment, set environment variables in Vercel dashboard:
   - Go to your project in Vercel dashboard
   - Settings → Environment Variables
   - Add:
     - `MAPBOX_ACCESS_TOKEN` = `pk.eyJ1IjoicmlhemExNjIiLCJhIjoiY21nMmhkeG05MDdtcDJycG95aDNkNGRrayJ9.okIiL_beCCP6u1W6kdX02w`
     - `DATABASE_URL` = `file:./dev.db` (or use Vercel Postgres)
     - `JWT_SECRET` = (generate a random string)
     - Optional: `NYC_OPEN_DATA_API_KEY`, `NYC_511_API_KEY`, etc.

7. **Redeploy** (after setting env vars):
```bash
vercel --prod
```

### Option 2: GitHub Integration

1. **Push code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import to Vercel**:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings

3. **Set Environment Variables** (same as above)

4. **Deploy** - Vercel will deploy automatically!

## Environment Variables

### Required
- `MAPBOX_ACCESS_TOKEN` - Your Mapbox token (already configured)

### Optional but Recommended
- `DATABASE_URL` - For production, use Vercel Postgres or external PostgreSQL
- `JWT_SECRET` - Random string for JWT tokens
- `NYC_OPEN_DATA_API_KEY` - For crash/crime data
- `NYC_511_API_KEY` - For live traffic data

## Using Vercel Postgres

1. **Add Vercel Postgres**:
   - In your Vercel project, go to Storage
   - Click "Create Database"
   - Select "Postgres"
   - Copy the `DATABASE_URL`

2. **Update Prisma schema** for production:
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Or keep SQLite for development, use Postgres for production

3. **Run migrations**:
```bash
npx prisma migrate deploy
```

## Update Frontend API URL

After deployment, update your frontend `.env`:

```
VITE_API_URL=https://your-app.vercel.app
```

## Testing Deployment

1. **Check health endpoint**:
```
https://your-app.vercel.app/health
```

2. **Test route generation**:
```bash
curl -X POST https://your-app.vercel.app/route \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 40.758896, "lng": -73.985428},
    "destination": {"lat": 40.785091, "lng": -73.968285},
    "mode": "driving",
    "safetyPreference": 50
  }'
```

## Troubleshooting

### Build Fails
- Check that all TypeScript errors are fixed
- Run `npm run build` locally first
- Check Vercel build logs

### Runtime Errors
- Check environment variables are set
- Check database connection
- Check Vercel function logs

### API Not Working
- Verify CORS origins include your frontend URL
- Check API endpoint paths
- Verify Mapbox token is set

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database configured (Vercel Postgres or external)
- [ ] Frontend API URL updated
- [ ] CORS origins configured
- [ ] JWT_SECRET set to secure random string
- [ ] All optional API keys added (if needed)
- [ ] Test all endpoints
- [ ] Monitor Vercel logs

## Support

For Vercel-specific issues:
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

