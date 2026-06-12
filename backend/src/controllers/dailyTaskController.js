const DailyTask = require('../models/DailyTask');
const Checklist = require('../models/Checklist');
const logger = require('../utils/logger');

/**
 * DailyTaskController
 * Handles API logic for daily recurring habits.
 */
class DailyTaskController {
    /**
     * Get all daily tasks including their sub-task progress.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async getAll(req, res, next) {
        try {
            logger.info('Executing DailyTaskController.getAll');
            const tasks = await DailyTask.findAll();
            logger.info(`Successfully retrieved ${tasks.length} daily tasks`);
            res.json({ success: true, data: tasks });
        } catch (err) {
            logger.error(`Error in DailyTaskController.getAll: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }

    /**
     * Create a new daily task and optional checklist.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async create(req, res, next) {
        try {
            const { title, target_time, buffer_minutes, checklist } = req.body;
            logger.info(`Executing DailyTaskController.create for title: "${title}"`);
            
            if (!title) {
                logger.warn('DailyTask creation failed: Missing title');
                return res.status(400).json({ error: 'Title is required' });
            }
            
            const id = await DailyTask.create({ title, target_time, buffer_minutes });
            logger.debug(`Created base daily task with ID: ${id}`);
            
            if (checklist?.length) {
                logger.info(`Adding ${checklist.length} checklist items to task ID ${id}`);
                await Checklist.addItems(id, checklist);
            }
            
            res.status(201).json({ success: true, data: { id } });
        } catch (err) {
            logger.error(`Error in DailyTaskController.create: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }

    /**
     * Reset all daily tasks checklist items to incomplete.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async reset(req, res, next) {
        try {
            logger.info('Executing DailyTaskController.reset');
            const count = await DailyTask.resetAll();
            logger.info(`Successfully reset ${count} daily tasks`);
            res.json({ success: true, message: `Reset ${count} daily tasks` });
        } catch (err) {
            logger.error(`Error in DailyTaskController.reset: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }
    /**
     * Update an existing daily task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, target_time, buffer_minutes, status } = req.body;
            await DailyTask.update(id, { title, target_time, buffer_minutes, status });
            res.json({ success: true, message: 'Daily task updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a daily task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await DailyTask.delete(id);
            res.json({ success: true, message: 'Daily task deleted successfully' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get streak data for the last 365 days for a specific daily task.
     */
    static async getStreak(req, res, next) {
        try {
            const { id } = req.params;
            const db = require('../config/db');

            // Find all checklist items for this task
            const [items] = await db.query('SELECT id FROM checklist_items WHERE task_id = ?', [id]);
            const totalItems = items.length;

            if (totalItems === 0) {
                return res.json({ success: true, data: [] });
            }

            // Get completions over the last 365 days
            const [rows] = await db.query(`
                SELECT d.date, SUM(d.is_completed) as completed_count
                FROM daily_log_items d
                JOIN checklist_items c ON d.checklist_item_id = c.id
                WHERE c.task_id = ? AND d.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY)
                GROUP BY d.date
            `, [id]);

            const streakData = rows.map(row => ({
                date: row.date,
                is_completed: parseInt(row.completed_count) >= totalItems
            }));

            res.json({ success: true, data: streakData });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = DailyTaskController;
