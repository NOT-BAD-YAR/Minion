const SmallTask = require('../models/SmallTask');
const Checklist = require('../models/Checklist');
const logger = require('../utils/logger');

/**
 * SmallTaskController
 * Handles API logic for 'Quick Win' small tasks.
 */
class SmallTaskController {
    /**
     * Get all small tasks including their sub-task progress.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async getAll(req, res, next) {
        try {
            logger.info('Executing SmallTaskController.getAll');
            const tasks = await SmallTask.findAll();
            logger.info(`Successfully retrieved ${tasks.length} small tasks`);
            res.json({ success: true, data: tasks });
        } catch (err) {
            logger.error(`Error in SmallTaskController.getAll: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }

    /**
     * Create a new small task and optional checklist.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async create(req, res, next) {
        try {
            const { title, target_time, buffer_minutes, checklist } = req.body;
            logger.info(`Executing SmallTaskController.create for title: "${title}"`);
            
            if (!title) {
                logger.warn('SmallTask creation failed: Missing title');
                return res.status(400).json({ error: 'Title is required' });
            }
            
            const id = await SmallTask.create({ title, target_time, buffer_minutes });
            logger.debug(`Created base small task with ID: ${id}`);
            
            if (checklist?.length) {
                logger.info(`Adding ${checklist.length} checklist items to task ID ${id}`);
                await Checklist.addItems(id, checklist);
            }
            
            res.status(201).json({ success: true, data: { id } });
        } catch (err) {
            logger.error(`Error in SmallTaskController.create: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }
    /**
     * Update an existing small task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const { title, target_time, buffer_minutes, status } = req.body;
            await SmallTask.update(id, { title, target_time, buffer_minutes, status });
            res.json({ success: true, message: 'Small task updated successfully' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a small task.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await SmallTask.delete(id);
            res.json({ success: true, message: 'Small task deleted successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = SmallTaskController;
