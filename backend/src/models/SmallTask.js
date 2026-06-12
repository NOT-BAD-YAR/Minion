const db = require('../config/db');
const BaseTask = require('./BaseTask');
const logger = require('../utils/logger');

/**
 * Small Task Model ("Quick Wins")
 * Single, one-time actions with a specific target time.
 */
class SmallTask extends BaseTask {
    /**
     * Create a new Small Task
     * @param {Object} data - { title, target_time, buffer_minutes }
     * @returns {Promise<number>} Task ID
     */
    static async create(data) {
        logger.info(`Creating SMALL task: ${data.title}`);
        const [result] = await db.query(
            'INSERT INTO tasks (title, type, target_time, buffer_minutes) VALUES (?, ?, ?, ?)',
            [data.title, 'SMALL', data.target_time, data.buffer_minutes || 0]
        );
        return result.insertId;
    }

    /**
     * Fetch all Small Tasks
     */
    static async findAll() {
        return super.findAllByType('SMALL');
    }
}

module.exports = SmallTask;
