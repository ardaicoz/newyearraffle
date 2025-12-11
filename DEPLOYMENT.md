# New Year's Raffle - Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended - Free Tier Available)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install && npm run init-db`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Click "Create Web Service"

Your app will be live in a few minutes!

### Option 2: Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect settings
6. Add initialization command in settings:
   - Run `npm run init-db` before first start

### Option 3: Heroku

```bash
# Install Heroku CLI first
heroku login
heroku create your-raffle-app
git push heroku main
heroku run npm run init-db
heroku open
```

### Option 4: Local/VPS Deployment

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start the server
npm start
```

Server will run on http://localhost:3000

## Environment Variables

The app works out of the box, but you can customize:

- `PORT` - Server port (default: 3000)

## Database Persistence

The app uses SQLite (`raffle.db` file). On platforms like Render:
- Use persistent disk storage for production
- Or connect to external PostgreSQL (requires code modification)

## Resetting the Raffle

To reset all draws and start fresh:

```bash
# Option 1: Re-run initialization
npm run init-db

# Option 2: API call
curl -X POST http://your-domain.com/api/reset

# Option 3: Delete the database file
rm raffle.db
npm run init-db
```

## Customizing Names and Missions

Edit `config.js` and modify:
- `participants` array - List of participant names
- `missions` array - List of possible missions

After changes, run `npm run init-db` to reset the database.

## Troubleshooting

**Database not initialized?**
```bash
npm run init-db
```

**Port already in use?**
```bash
PORT=3001 npm start
```

**Need to check current draws?**
Visit: `http://your-domain.com/api/draws`

**Need to check statistics?**
Visit: `http://your-domain.com/api/stats`
