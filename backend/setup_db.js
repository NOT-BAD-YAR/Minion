const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function setupDatabase() {
    try {
        console.log('Connecting to MySQL Server...');
        const host = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
        const user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
        const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
        const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
        const database = process.env.MYSQLDATABASE || process.env.DB_NAME || 'minion_db';

        // Connect WITHOUT a specific database to create it first
        const connection = await mysql.createConnection({ host, user, password, port });

        console.log(`Connected! Creating database '${database}' if it does not exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        
        console.log(`Switching to '${database}'...`);
        await connection.query(`USE \`${database}\``);

        console.log('Creating `tasks` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type ENUM('SMALL', 'DAILY', 'LONG') NOT NULL,
                target_time TIME,
                buffer_minutes INT DEFAULT 0,
                due_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating `checklist_items` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS checklist_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                content VARCHAR(255) NOT NULL,
                is_completed BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
        `);

        console.log('Creating `progress_history` table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS progress_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT NOT NULL,
                date DATE NOT NULL,
                completion_percentage INT NOT NULL,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
        `);

        console.log('Database and all tables created successfully!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up the database:', error);
        process.exit(1);
    }
}

setupDatabase();
