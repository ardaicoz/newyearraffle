const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database('raffle.db');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all available participants (those who haven't drawn yet)
app.get('/api/available-participants', (req, res) => {
  try {
    const participants = db.prepare('SELECT name FROM available_names ORDER BY name').all();
    res.json(participants.map(p => p.name));
  } catch (error) {
    console.error('Error fetching available participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Get all drawn results (for admin view - optional)
app.get('/api/draws', (req, res) => {
  try {
    const draws = db.prepare('SELECT * FROM draws ORDER BY drawn_at DESC').all();
    res.json(draws);
  } catch (error) {
    console.error('Error fetching draws:', error);
    res.status(500).json({ error: 'Failed to fetch draws' });
  }
});

// Perform a draw for a selected participant
app.post('/api/draw', (req, res) => {
  const { participant } = req.body;

  if (!participant || typeof participant !== 'string') {
    return res.status(400).json({ error: 'Participant name is required' });
  }

  try {
    // Start a transaction
    const transaction = db.transaction(() => {
      // Check if this participant is available
      const isAvailable = db.prepare('SELECT name FROM available_names WHERE name = ?').get(participant);
      
      if (!isAvailable) {
        throw new Error('This participant has already drawn or does not exist');
      }

      // Get all participant names from config (excluding the participant themselves)
      const allNames = config.participants.filter(name => name !== participant);

      if (allNames.length === 0) {
        throw new Error('No names available to draw');
      }

      // Randomly select a name
      const randomIndex = Math.floor(Math.random() * allNames.length);
      const pickedName = allNames[randomIndex];

      // Randomly select a mission
      const randomMissionIndex = Math.floor(Math.random() * config.missions.length);
      const mission = config.missions[randomMissionIndex];

      // Record the draw
      db.prepare('INSERT INTO draws (participant, picked_name, mission) VALUES (?, ?, ?)').run(
        participant,
        pickedName,
        mission
      );

      // Remove ONLY the participant from available names (they've drawn)
      db.prepare('DELETE FROM available_names WHERE name = ?').run(participant);

      return { participant, pickedName, mission };
    });

    const result = transaction();
    res.json(result);
  } catch (error) {
    console.error('Error performing draw:', error);
    res.status(400).json({ error: error.message });
  }
});

// Reset the raffle (for admin use)
app.post('/api/reset', (req, res) => {
  try {
    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM draws').run();
      db.prepare('DELETE FROM available_names').run();
      
      const insertName = db.prepare('INSERT INTO available_names (name) VALUES (?)');
      for (const name of config.participants) {
        insertName.run(name);
      }
    });

    transaction();
    res.json({ message: 'Raffle reset successfully' });
  } catch (error) {
    console.error('Error resetting raffle:', error);
    res.status(500).json({ error: 'Failed to reset raffle' });
  }
});

// Get raffle statistics
app.get('/api/stats', (req, res) => {
  try {
    const totalParticipants = config.participants.length;
    const drawnCount = db.prepare('SELECT COUNT(*) as count FROM draws').get().count;
    const remainingCount = db.prepare('SELECT COUNT(*) as count FROM available_names').get().count;

    res.json({
      total: totalParticipants,
      drawn: drawnCount,
      remaining: remainingCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🎉 New Year's Raffle Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: raffle.db`);
  console.log(`👥 Total participants: ${config.participants.length}`);
  console.log(`🎯 Total missions: ${config.missions.length}`);
});
