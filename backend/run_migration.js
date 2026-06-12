const fs = require('fs');
const db = require('./src/config/db');

async function runMigration() {
  try {
    console.log('Running migration...');
    const sql = fs.readFileSync('./src/migrations/002_create_daily_logs.sql', 'utf8');
    
    // Split by semicolon and run each command
    const commands = sql.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (let cmd of commands) {
      console.log('Executing:', cmd.trim());
      await db.query(cmd);
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
