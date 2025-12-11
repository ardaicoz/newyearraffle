const Database = require('better-sqlite3');
const config = require('./config');

// Initialize the database
const db = new Database('raffle.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant TEXT NOT NULL UNIQUE,
    picked_name TEXT NOT NULL,
    mission TEXT NOT NULL,
    drawn_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS available_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
`);

console.log('✅ Database tables created successfully!');

// Clear existing data (for fresh start)
db.prepare('DELETE FROM draws').run();
db.prepare('DELETE FROM available_names').run();

// Insert all participants as available names
const insertName = db.prepare('INSERT INTO available_names (name) VALUES (?)');
const insertMany = db.transaction((names) => {
  for (const name of names) {
    insertName.run(name);
  }
});

insertMany(config.participants);

console.log(`✅ Initialized ${config.participants.length} participants`);
console.log(`✅ Configured ${config.missions.length} missions`);
console.log('✅ Database initialization complete!');

db.close();
