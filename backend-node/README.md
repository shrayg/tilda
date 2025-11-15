# SafeRoute Backend (Node.js/TypeScript)

Fast, robust Node.js/TypeScript backend for SafeRoute API, optimized for Vercel deployment.

## Features

- ✅ **Node.js/TypeScript** - No Python dependency issues
- ✅ **Vercel-ready** - Deploy in seconds
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Fast API** - Express.js with serverless functions
- ✅ **Database** - Prisma with SQLite (or PostgreSQL)
- ✅ **Authentication** - JWT with Google/Apple/Email support
- ✅ **NYC Data Integration** - All data sources included

## Quick Start

### 1. Install Dependencies

```bash
cd backend-node
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Mapbox token:

```
MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Locally

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `MAPBOX_ACCESS_TOKEN`
   - `DATABASE_URL` (use Vercel Postgres or external)
   - Other optional keys

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy!

### Environment Variables for Vercel

Required:
- `MAPBOX_ACCESS_TOKEN` - Your Mapbox token

Optional (but recommended):
- `DATABASE_URL` - PostgreSQL connection string (use Vercel Postgres)
- `NYC_OPEN_DATA_API_KEY` - For crash/crime data
- `NYC_511_API_KEY` - For live traffic data
- `JWT_SECRET` - Secret for JWT tokens

## Project Structure

```
backend-node/
├── api/
│   ├── index.ts          # Main Express app
│   ├── config.ts         # Configuration
│   ├── types.ts          # TypeScript types
│   ├── routes/           # API routes
│   │   ├── auth.ts       # Authentication
│   │   ├── data.ts       # Data endpoints
│   │   ├── pins.ts       # User pins
│   │   └── route.ts      # Route generation
│   ├── services/         # Business logic
│   │   └── dataService.ts # NYC data fetching
│   ├── utils/            # Utilities
│   │   ├── auth.ts       # Auth helpers
│   │   └── db.ts         # Database client
│   └── middleware/       # Express middleware
│       └── auth.ts       # Auth middleware
├── prisma/
│   └── schema.prisma     # Database schema
├── vercel.json           # Vercel configuration
├── package.json
└── tsconfig.json
```

## API Endpoints

All endpoints work the same as the Python version:

- `POST /route` - Get 10 alternative routes with safety ratings
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/apple` - Apple OAuth
- `GET /api/auth/me` - Get current user
- `GET /api/data/crashes` - Get crash data
- `GET /api/data/crime` - Get crime data
- `GET /api/data/speeding` - Get speeding data
- `GET /api/data/construction` - Get construction data
- `GET /api/data/weather` - Get weather data
- `GET /api/data/alerts` - Get weather alerts
- `GET /api/pins` - Get user pins
- `POST /api/pins` - Create pin (auth required)
- `DELETE /api/pins/:id` - Delete pin (auth required)

## Database

### Development (SQLite)

Uses SQLite by default - no setup needed!

### Production (PostgreSQL)

For Vercel, use **Vercel Postgres**:

1. Go to your Vercel project
2. Add "Vercel Postgres" integration
3. Update `DATABASE_URL` environment variable
4. Run migrations:
```bash
npx prisma migrate deploy
```

## Development

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run type-check
```

## Troubleshooting

### Database Issues

If you get database errors:
1. Run `npx prisma generate`
2. Run `npx prisma migrate dev`

### Vercel Deployment Issues

1. Make sure `vercel.json` is in the root
2. Check that all environment variables are set
3. Ensure Node.js version is 18+ (set in `package.json`)

### Missing Dependencies

If packages are missing:
```bash
npm install
```

## Differences from Python Version

- **Faster startup** - No Python initialization
- **Better Vercel integration** - Native Node.js support
- **Easier debugging** - Better error messages
- **Same API** - Drop-in replacement

## License

MIT

