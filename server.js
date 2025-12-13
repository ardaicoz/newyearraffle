const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database('raffle.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    mission TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant TEXT NOT NULL UNIQUE,
    picked_name TEXT NOT NULL,
    mission TEXT NOT NULL,
    drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS available_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    mission TEXT NOT NULL
  );
`);

console.log('✅ Database tables initialized');

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
    res.status(500).json({ error: 'Kat\u0131l\u0131mc\u0131lar y\u00fcklenemedi' });
  }
});

// Get all drawn results (for admin view - optional)
app.get('/api/draws', (req, res) => {
  try {
    const draws = db.prepare('SELECT * FROM draws ORDER BY drawn_at DESC').all();
    res.json(draws);
  } catch (error) {
    console.error('Error fetching draws:', error);
    res.status(500).json({ error: '\u00c7ekimler y\u00fcklenemedi' });
  }
});

// Perform a draw for a selected participant
app.post('/api/draw', (req, res) => {
  const { participant } = req.body;

  if (!participant || typeof participant !== 'string') {
    return res.status(400).json({ error: 'Kat\u0131l\u0131mc\u0131 ismi gerekli' });
  }

  try {
    // Start a transaction
    const transaction = db.transaction(() => {
      // Check if this participant is available
      const isAvailable = db.prepare('SELECT name FROM available_names WHERE name = ?').get(participant);
      
      if (!isAvailable) {
        throw new Error('Bu katılımcı zaten çekti veya mevcut değil');
      }

      // Get names that haven't been picked yet (excluding the participant themselves)
      // A name is available to be picked if:
      // 1. It's in the participants table
      // 2. It's not the current participant (can't pick yourself)
      // 3. It hasn't been picked by someone else yet (not in draws.picked_name)
      const availableToPick = db.prepare(`
        SELECT p.name FROM participants p
        WHERE p.name != ?
        AND p.name NOT IN (SELECT picked_name FROM draws)
      `).all(participant);
      
      if (availableToPick.length === 0) {
        throw new Error('Çekilecek isim kalmadı - herkes seçildi');
      }

      // Randomly select a name
      const randomIndex = Math.floor(Math.random() * availableToPick.length);
      const pickedName = availableToPick[randomIndex].name;

      // Get the mission associated with the picked person from the permanent participants table
      const pickedPersonData = db.prepare('SELECT mission FROM participants WHERE name = ?').get(pickedName);
      
      if (!pickedPersonData) {
        throw new Error('Seçilen kişi için görev bulunamadı');
      }
      
      const mission = pickedPersonData.mission;

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
      
      // Repopulate available_names from participants table
      const participants = db.prepare('SELECT name, mission FROM participants').all();
      const insertName = db.prepare('INSERT INTO available_names (name, mission) VALUES (?, ?)');
      for (const participant of participants) {
        insertName.run(participant.name, participant.mission);
      }
    });

    transaction();
    res.json({ message: 'Çekiliş başarıyla sıfırlandı' });
  } catch (error) {
    console.error('Error resetting raffle:', error);
    res.status(500).json({ error: 'Çekiliş sıfırlanamadı' });
  }
});

// Add test data (for testing purposes)
app.post('/api/add-test-data', (req, res) => {
  const testParticipants = [
    { name: 'Test Kişi 1', mission: 'Test için komik bir şey al' },
    { name: 'Test Kişi 2', mission: 'Test için rahat bir şey al' },
    { name: 'Test Kişi 3', mission: 'Test için pratik bir şey al' },
    { name: 'Test Kişi 4', mission: 'Test için yaratıcı bir şey al' },
    { name: 'Test Kişi 5', mission: 'Test için el yapımı bir şey al' }
  ];

  try {
    const transaction = db.transaction(() => {
      const insertParticipant = db.prepare('INSERT OR IGNORE INTO participants (name, mission) VALUES (?, ?)');
      const insertAvailable = db.prepare('INSERT OR IGNORE INTO available_names (name, mission) VALUES (?, ?)');
      
      for (const p of testParticipants) {
        insertParticipant.run(p.name, p.mission);
        insertAvailable.run(p.name, p.mission);
      }
    });
    
    transaction();
    res.json({ message: `${testParticipants.length} test katılımcısı eklendi` });
  } catch (error) {
    console.error('Error adding test data:', error);
    res.status(500).json({ error: 'Test verileri eklenemedi' });
  }
});

// Clear all participants (for testing purposes)
app.post('/api/clear-all', (req, res) => {
  try {
    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM draws').run();
      db.prepare('DELETE FROM available_names').run();
      db.prepare('DELETE FROM participants').run();
    });
    
    transaction();
    res.json({ message: 'Tüm veriler başarıyla temizlendi' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Veriler temizlenemedi' });
  }
});

// Get raffle statistics
app.get('/api/stats', (req, res) => {
  try {
    const totalParticipants = db.prepare('SELECT COUNT(*) as count FROM participants').get().count;
    const drawnCount = db.prepare('SELECT COUNT(*) as count FROM draws').get().count;
    const remainingCount = db.prepare('SELECT COUNT(*) as count FROM available_names').get().count;

    res.json({
      total: totalParticipants,
      drawn: drawnCount,
      remaining: remainingCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'İstatistikler yüklenemedi' });
  }
});

// Get all participants with their missions
app.get('/api/participants', (req, res) => {
  try {
    const participants = db.prepare('SELECT name, mission FROM participants ORDER BY name').all();
    res.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Kat\u0131l\u0131mc\u0131lar y\u00fcklenemedi' });
  }
});

// Add a new participant
app.post('/api/participants', (req, res) => {
  const { name, mission } = req.body;

  if (!name || !mission || typeof name !== 'string' || typeof mission !== 'string') {
    return res.status(400).json({ error: 'İsim ve görev gerekli' });
  }

  try {
    const transaction = db.transaction(() => {
      db.prepare('INSERT INTO participants (name, mission) VALUES (?, ?)').run(name.trim(), mission.trim());
      db.prepare('INSERT INTO available_names (name, mission) VALUES (?, ?)').run(name.trim(), mission.trim());
    });
    transaction();
    res.json({ message: 'Katılımcı başarıyla eklendi', name, mission });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Katılımcı zaten mevcut' });
    } else {
      console.error('Error adding participant:', error);
      res.status(500).json({ error: 'Katılımcı eklenemedi' });
    }
  }
});

// Delete a participant
app.delete('/api/participants/:name', (req, res) => {
  const { name } = req.params;

  try {
    const transaction = db.transaction(() => {
      const result = db.prepare('DELETE FROM participants WHERE name = ?').run(name);
      db.prepare('DELETE FROM available_names WHERE name = ?').run(name);
      return result;
    });
    
    const result = transaction();
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Katılımcı bulunamadı' });
    }
    
    res.json({ message: 'Katılımcı başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Katılımcı silinemedi' });
  }
});

// Update a participant's mission
app.put('/api/participants/:name', (req, res) => {
  const { name } = req.params;
  const { mission } = req.body;

  if (!mission || typeof mission !== 'string') {
    return res.status(400).json({ error: 'Görev gerekli' });
  }

  try {
    const transaction = db.transaction(() => {
      const result = db.prepare('UPDATE participants SET mission = ? WHERE name = ?').run(mission.trim(), name);
      db.prepare('UPDATE available_names SET mission = ? WHERE name = ?').run(mission.trim(), name);
      return result;
    });
    
    const result = transaction();
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Katılımcı bulunamadı' });
    }
    
    res.json({ message: 'Katılımcı başarıyla güncellendi' });
  } catch (error) {
    console.error('Error updating participant:', error);
    res.status(500).json({ error: 'Katılımcı güncellenemedi' });
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
  console.log(`🎯 Each participant has their own mission`);
});
