const Database = require('better-sqlite3');
const config = require('./config');

// Initialize the database
const db = new Database('raffle.db');

// Drop existing tables to ensure clean schema
db.exec(`
  DROP TABLE IF EXISTS draws;
  DROP TABLE IF EXISTS available_names;
  DROP TABLE IF EXISTS participants;
`);

// Create tables
db.exec(`
  CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    mission TEXT NOT NULL
  );

  CREATE TABLE draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant TEXT NOT NULL UNIQUE,
    picked_name TEXT NOT NULL,
    mission TEXT NOT NULL,
    drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE available_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    mission TEXT NOT NULL
  );
`);

console.log('✅ Database tables created successfully!');

// Clear existing data (for fresh start)
db.prepare('DELETE FROM draws').run();
db.prepare('DELETE FROM available_names').run();
db.prepare('DELETE FROM participants').run();

// Insert all participants with their missions
const insertParticipant = db.prepare('INSERT INTO participants (name, mission) VALUES (?, ?)');
const insertAvailable = db.prepare('INSERT INTO available_names (name, mission) VALUES (?, ?)');
const insertMany = db.transaction(() => {
  for (const [name, mission] of Object.entries(config.participantMissions)) {
    insertParticipant.run(name, mission);
    insertAvailable.run(name, mission);
  }
});

insertMany();

console.log(`✅ Initialized ${config.participants.length} participants`);
console.log(`✅ Each participant has their own mission`);
console.log('✅ Database initialization complete!');

db.close();
