# 🎉 New Year's Raffle 🎁

A simple web-based draw names application for organizing a New Year's gift exchange raffle with missions!

## 📝 Description

This application helps you organize a fun gift exchange where each participant:
1. Draws another person's name (Secret Santa style)
2. Gets assigned a mission that determines what type of gift they should buy

The gift they purchase must be suitable for their assigned mission, adding an extra layer of creativity to your gift exchange!

## 🚀 How to Use

1. **Open the Application**: Simply open `index.html` in your web browser
2. **Add Participants**: Enter the names of everyone participating in the raffle
3. **Add Missions**: Enter different mission types (e.g., "Buy something funny", "Buy something cozy", "Buy something practical")
4. **Draw Names & Missions**: Click the "Draw Names & Missions!" button to randomly assign:
   - Who each person should buy a gift for
   - What mission they should follow when choosing the gift

## ✨ Features

- **Random Assignment**: Each participant gets randomly assigned another person's name and a mission
- **No Self-Assignment**: The algorithm ensures no one picks their own name
- **Unique Assignments**: Each person picks exactly one other person (Secret Santa style)
- **Persistent Data**: Your participants and missions are saved in localStorage, so they persist across page refreshes
- **Easy Management**: Add or remove participants and missions at any time
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern, colorful interface with smooth animations

## 🎯 Example Missions

- Buy something funny
- Buy something cozy
- Buy something practical
- Buy something creative
- Buy something handmade
- Buy something nostalgic
- Buy something edible
- Buy something decorative

## 🛠️ Technical Details

- **Pure HTML/CSS/JavaScript**: No dependencies or build process required
- **localStorage**: Data persists between sessions
- **Mobile Responsive**: Works on all screen sizes

## 📱 Running Locally

Simply open the `index.html` file in any modern web browser. No server required!

If you want to run it on a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## 🎨 Customization

Feel free to customize:
- Colors and styling in the CSS section
- Default mission examples
- UI text and emojis
- Draw logic if you want different assignment rules

Enjoy your New Year's raffle! 🎊