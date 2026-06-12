const LongTask = require('../models/LongTask');
const Checklist = require('../models/Checklist');
const logger = require('../utils/logger');

/**
 * LongTaskController
 * Handles API logic for multi-day project tasks.
 */
class LongTaskController {
    /**
     * Get all long tasks including their sub-task progress.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async getAll(req, res, next) {
        try {
            logger.info('Executing LongTaskController.getAll');
            const tasks = await LongTask.findAll();
            logger.info(`Successfully retrieved ${tasks.length} long tasks`);
            res.json({ success: true, data: tasks });
        } catch (err) {
            logger.error(`Error in LongTaskController.getAll: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }

    /**
     * Create a new long task and optional checklist.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async create(req, res, next) {
        try {
            const { title, due_date, checklist } = req.body;
            logger.info(`Executing LongTaskController.create for title: "${title}"`);
            
            if (!title) {
                logger.warn('LongTask creation failed: Missing title');
                return res.status(400).json({ error: 'Title is required' });
            }
            
            const id = await LongTask.create({ title, due_date });
            logger.debug(`Created base long task with ID: ${id}`);
            
            if (checklist?.length) {
                logger.info(`Adding ${checklist.length} checklist items to task ID ${id}`);
                await Checklist.addItems(id, checklist);
            }
            
            res.status(201).json({ success: true, data: { id } });
        } catch (err) {
            logger.error(`Error in LongTaskController.create: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }
    /**
     * Update an existing long task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, due_date, status } = req.body;
            await LongTask.update(id, { title, due_date, status });
            res.json({ success: true, message: 'Long task updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a long task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await LongTask.delete(id);
            res.json({ success: true, message: 'Long task deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = LongTaskController;
