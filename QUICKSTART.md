# Quick Reference Guide

## 🚀 Local Development

### First Time Setup
```bash
npm install
npm run init-db
npm start
```

Visit: http://localhost:3000

### Edit Participants/Missions
1. Edit `config.js`
2. Run `npm run init-db`
3. Restart server (`npm start`)

### Reset Everything
```bash
npm run init-db
```

## 🌐 Deployment Checklist

### Before Deploying
- [ ] Update `config.js` with real participant names
- [ ] Customize missions for your group
- [ ] Test locally
- [ ] Push to GitHub

### Render Deployment (Recommended)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Build: `npm install && npm run init-db`
   - Start: `npm start`
   - Environment: Node
5. Deploy!

### After Deployment
- Share the URL with all participants
- Participants visit the site and select their name
- Each person draws once
- Monitor progress via stats at top

## 🔧 Useful Commands

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Start server
npm start

# Start with auto-reload (dev)
npm run dev

# Reset the raffle
curl -X POST http://localhost:3000/api/reset

# View all draws (admin)
curl http://localhost:3000/api/draws

# Check statistics
curl http://localhost:3000/api/stats
```

## 📁 Project Structure

```
newyearraffle/
├── config.js           # Participants & missions (EDIT THIS!)
├── server.js           # Backend API
├── init-db.js          # Database initialization
├── package.json        # Dependencies
├── raffle.db          # SQLite database (auto-generated)
├── public/
│   └── index.html     # Frontend UI
├── DEPLOYMENT.md      # Deployment guide
└── README.md          # Documentation
```

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 npm start
```

**Database locked?**
```bash
rm raffle.db
npm run init-db
```

**Need to start fresh?**
```bash
npm run init-db  # Resets everything
```

**Participants can't access?**
- Make sure server is running
- Check firewall settings
- Use deployed URL instead of localhost

## 💡 Tips

1. **Keep it secret**: Tell participants not to share their assignments
2. **One device per person**: Each person should use their own device
3. **Test first**: Do a test run with fake names before the real event
4. **Screenshot results**: Participants should screenshot their assignment
5. **Admin view**: Visit `/api/draws` to see all assignments (admin only!)

## 🎉 Have Fun!

Your raffle is ready! Each participant:
1. Opens the website
2. Selects their name
3. Clicks "Draw Names & Mission!"
4. Sees their assignment with fancy animations 🎊
