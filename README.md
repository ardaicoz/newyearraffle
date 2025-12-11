# 🎉 New Year's Raffle 🎁

A multi-user web application for organizing a New Year's gift exchange raffle with missions and persistence!

## 📝 Description

This application helps you organize a fun gift exchange where each participant:
1. Selects their name from a list of available participants
2. Draws another person's name (Secret Santa style)
3. Gets assigned a mission that determines what type of gift they should buy
4. Once drawn, their name and the picked name are removed from the pool

Perfect for office parties, family gatherings, or friend groups!

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Initialize the database with your participants and missions
npm run init-db

# Start the server
npm start
```

Visit http://localhost:3000 and start the raffle!

## 🎮 How to Use

1. **Select Your Name**: Each participant opens the website and selects their name from the available list
2. **Draw**: Click the "Draw Names & Mission!" button
3. **See Results**: After a fancy animation, your assigned person and mission are revealed
4. **One Draw Per Person**: Once you draw, your name is removed from the list
5. **Keep It Secret**: Don't share your assignment with others!

## ✨ Features

- **Multi-User Support**: Multiple people can participate sequentially
- **Persistent Database**: Uses SQLite to track who has drawn
- **Name Tracking**: Prevents duplicate draws and ensures fairness
- **Fancy Animations**: Loading animations, confetti, and smooth transitions
- **Live Statistics**: See how many people have drawn vs remaining
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, colorful interface with gradient backgrounds
- **API Endpoints**: RESTful API for future extensions

## ⚙️ Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
  participants: [
    'Alice', 'Bob', 'Charlie', 'Diana',
    // Add your participants here
  ],
  
  missions: [
    'Buy something funny that will make everyone laugh',
    'Buy something cozy and comfortable',
    // Add your missions here
  ]
};
```

After editing, run `npm run init-db` to reset the database.

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Render:**
1. Push to GitHub
2. Connect to Render
3. Set build command: `npm install && npm run init-db`
4. Set start command: `npm start`
5. Deploy!

## 🛠️ Technical Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Ready for Render, Railway, Heroku, or any Node.js host

## 📊 API Endpoints

- `GET /api/available-participants` - Get list of participants who haven't drawn yet
- `GET /api/stats` - Get raffle statistics (total, drawn, remaining)
- `GET /api/draws` - Get all draw results (admin view)
- `POST /api/draw` - Perform a draw for a participant
- `POST /api/reset` - Reset the entire raffle

## 🔄 Resetting the Raffle

```bash
# Re-initialize the database
npm run init-db
```

Or via API:
```bash
curl -X POST http://localhost:3000/api/reset
```

## 🎯 Example Missions

- Buy something funny that will make everyone laugh
- Buy something cozy and comfortable
- Buy something practical and useful
- Buy something creative and artistic
- Buy something handmade or DIY
- Buy something nostalgic from the past
- Buy something edible and delicious
- Buy something decorative for the home
- Buy something tech-related
- Buy something for self-care and relaxation

## 📱 Development

```bash
# Install dev dependencies
npm install

# Run with auto-reload
npm run dev
```

## 🎨 Customization

- Edit `config.js` for participants and missions
- Modify `public/index.html` for UI changes
- Update `server.js` for backend logic

## 🤝 Contributing

Feel free to submit issues or pull requests!

## 📄 License

MIT

---

Enjoy your New Year's raffle! 🎊
