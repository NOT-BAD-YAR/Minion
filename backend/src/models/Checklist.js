const db = require('../config/db');
const logger = require('../utils/logger');

/**
 * Checklist Model
 * Handles operations and progress tracking for sub-tasks.
 */
class Checklist {
    /**
     * Get all checklist items for a specific task.
     * @param {number} taskId 
     */
    static async getByTaskId(taskId) {
        const [items] = await db.query('SELECT * FROM checklist_items WHERE task_id = ?', [taskId]);
        return items;
    }

    /**
     * Add multiple items to a task.
     * @param {number} taskId 
     * @param {Array<Object>} items 
     */
    static async addItems(taskId, items) {
        if (!items || items.length === 0) return;
        const values = items.map(item => [taskId, item.content]);
        await db.query('INSERT INTO checklist_items (task_id, content) VALUES ?', [values]);
    }

    /**
     * Toggle completion status automatically by finding the current status and inverting it.
     * For DAILY tasks, this toggles the status in daily_log_items for today.
     * @param {number} itemId 
     */
    static async toggleItem(itemId) {
        // Find the task type
        const [rows] = await db.query(
            `SELECT c.task_id, t.type, c.is_completed as base_completed 
             FROM checklist_items c 
             JOIN tasks t ON c.task_id = t.id 
             WHERE c.id = ?`, 
            [itemId]
        );
        
        if (rows.length === 0) throw new Error('Checklist item not found');
        const item = rows[0];

        if (item.type === 'DAILY') {
            // For daily tasks, we toggle in daily_log_items for CURRENT_DATE
            const [logRows] = await db.query(
                `SELECT is_completed FROM daily_log_items WHERE checklist_item_id = ? AND date = CURRENT_DATE()`,
                [itemId]
            );
            
            const currentStatus = logRows.length > 0 ? logRows[0].is_completed : false;
            const newStatus = !currentStatus;

            await db.query(
                `INSERT INTO daily_log_items (date, checklist_item_id, is_completed) 
                 VALUES (CURRENT_DATE(), ?, ?) 
                 ON DUPLICATE KEY UPDATE is_completed = VALUES(is_completed)`,
                [itemId, newStatus]
            );
        } else {
            // Standard toggle
            await db.query(
                'UPDATE checklist_items SET is_completed = NOT is_completed WHERE id = ?', 
                [itemId]
            );
        }
    }

    /**
     * Calculate and return the progress percentage of a task based on its sub-tasks.
     * @param {number} taskId 
     * @returns {Promise<number>} Percentage (0-100)
     */
    static async calculateProgress(taskId) {
        const items = await this.getByTaskId(taskId);
        if (items.length === 0) return 0;
        
        const completed = items.filter(i => i.is_completed).length;
        return Math.round((completed / items.length) * 100);
    }
}

module.exports = Checklist;
