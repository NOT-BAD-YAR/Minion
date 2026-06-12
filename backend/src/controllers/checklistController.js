const Checklist = require('../models/Checklist');
const logger = require('../utils/logger');

/**
 * ChecklistController
 * Handles API logic for individual sub-tasks.
 */
class ChecklistController {
    /**
     * Toggle the completion status of a checklist item.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware
     */
    static async toggle(req, res, next) {
        try {
            const { itemId } = req.params;
            
            logger.info(`Executing ChecklistController.toggle for item ID: ${itemId}`);
            
            if (itemId === undefined) {
                logger.warn('Checklist toggle failed: Missing itemId');
                return res.status(400).json({ error: 'Invalid parameters' });
            }
            
            await Checklist.toggleItem(itemId);
            logger.info(`Successfully toggled checklist item ${itemId}`);
            
            // Recalculate daily progress globally
            const ProgressController = require('./progressController');
            await ProgressController.updateTodayProgress();
            
            res.json({ success: true, message: 'Updated successfully' });
        } catch (err) {
            logger.error(`Error in ChecklistController.toggle: ${err.message}`, { stack: err.stack });
            next(err);
        }
    }
}

module.exports = ChecklistController;
