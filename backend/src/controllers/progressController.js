const db = require('../config/db');
const logger = require('../utils/logger');
const BaseTask = require('../models/BaseTask');
const Checklist = require('../models/Checklist');

class ProgressController {
    /**
     * Get cumulative daily progress for the past 7 days.
     */
    static async getDailyProgress(req, res, next) {
        try {
            logger.info('Fetching daily progress history');
            const [rows] = await db.query('SELECT * FROM progress_history ORDER BY date DESC LIMIT 7');
            res.json({ success: true, data: rows });
        } catch (err) {
            logger.error(`Error fetching progress: ${err.message}`);
            next(err);
        }
    }

    /**
     * Recalculate today's progress for ALL DAILY tasks, and update progress_history.
     * Called whenever a daily routine checklist item is toggled.
     */
    static async updateTodayProgress() {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Get all daily tasks
            const dailyTasks = await BaseTask.findAllByType('DAILY');
            if (!dailyTasks || dailyTasks.length === 0) return;

            let totalItems = 0;
            let completedItems = 0;

            for (const task of dailyTasks) {
                if (task.checklist && task.checklist.length > 0) {
                    totalItems += task.checklist.length;
                    completedItems += task.checklist.filter(i => i.is_completed).length;
                }
            }

            const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

            // Check if there's already a record for today (Task ID 0 acts as aggregate)
            const [existing] = await db.query('SELECT * FROM progress_history WHERE date = ? AND task_id = 0', [today]);

            if (existing.length > 0) {
                await db.query('UPDATE progress_history SET completion_percentage = ? WHERE id = ?', [percentage, existing[0].id]);
            } else {
                await db.query('INSERT INTO progress_history (task_id, date, completion_percentage) VALUES (0, ?, ?)', [today, percentage]);
            }
            logger.info(`Updated today's overall daily progress to ${percentage}%`);
        } catch (err) {
            logger.error(`Failed to update today progress: ${err.message}`);
        }
    }
}

module.exports = ProgressController;
