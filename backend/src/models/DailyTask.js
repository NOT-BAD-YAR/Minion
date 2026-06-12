const db = require('../config/db');
const BaseTask = require('./BaseTask');
const logger = require('../utils/logger');

/**
 * Daily Task Model ("Habits")
 * Recurring tasks that reset every midnight.
 */
class DailyTask extends BaseTask {
    /**
     * Create a new Daily Task
     * @param {Object} data - { title, target_time, buffer_minutes }
     */
    static async create(data) {
        logger.info(`Creating DAILY task: ${data.title}`);
        const [result] = await db.query(
            'INSERT INTO tasks (title, type, target_time, buffer_minutes) VALUES (?, ?, ?, ?)',
            [data.title, 'DAILY', data.target_time, data.buffer_minutes || 0]
        );
        return result.insertId;
    }

    /**
     * Fetch all Daily Tasks
     */
    static async findAll() {
        return super.findAllByType('DAILY');
    }

    /**
     * Reset all Daily Tasks to incomplete (for the midnight cron job)
     */
    static async resetAll() {
        logger.info('Resetting all DAILY tasks to incomplete');
        const [dailyTasks] = await db.query("SELECT id FROM tasks WHERE type = 'DAILY'");
        const dailyTaskIds = dailyTasks.map(t => t.id);
        
        if (dailyTaskIds.length > 0) {
            await db.query(
                'UPDATE checklist_items SET is_completed = FALSE WHERE task_id IN (?)',
                [dailyTaskIds]
            );
        }
        return dailyTaskIds.length;
    }
}

module.exports = DailyTask;
