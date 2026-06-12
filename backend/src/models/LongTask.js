const db = require('../config/db');
const BaseTask = require('./BaseTask');
const logger = require('../utils/logger');

/**
 * Long Task Model ("Projects")
 * Multi-day tasks with extended checklists.
 */
class LongTask extends BaseTask {
    /**
     * Create a new Long Task
     * @param {Object} data - { title, due_date }
     */
    static async create(data) {
        logger.info(`Creating LONG task: ${data.title}`);
        const [result] = await db.query(
            'INSERT INTO tasks (title, type, due_date) VALUES (?, ?, ?)',
            [data.title, 'LONG', data.due_date]
        );
        return result.insertId;
    }

    /**
     * Fetch all Long Tasks
     */
    static async findAll() {
        return super.findAllByType('LONG');
    }
}

module.exports = LongTask;
