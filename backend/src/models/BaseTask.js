const db = require('../config/db');
const Checklist = require('./Checklist');
const logger = require('../utils/logger');

/**
 * Base Task Model
 * Contains shared logic for all task types.
 */
class BaseTask {
    /**
     * Get all tasks of a specific type, including their progress.
     * @param {string} type - 'SMALL', 'DAILY', or 'LONG'
     */
    static async findAllByType(type) {
        logger.info(`Fetching all ${type} tasks`);
        const [tasks] = await db.query('SELECT * FROM tasks WHERE type = ? ORDER BY created_at DESC', [type]);
        
        // Attach checklist and dynamic progress to each task
        const tasksWithDetails = await Promise.all(tasks.map(async (task) => {
            let checklist;
            let progress = 0;

            if (type === 'DAILY') {
                // Fetch checklist items with today's completion log
                const [items] = await db.query(`
                    SELECT c.*, COALESCE(d.is_completed, 0) as is_completed
                    FROM checklist_items c
                    LEFT JOIN daily_log_items d ON c.id = d.checklist_item_id AND d.date = CURRENT_DATE()
                    WHERE c.task_id = ?
                `, [task.id]);
                checklist = items;
                
                const completed = items.filter(i => i.is_completed).length;
                progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;
            } else {
                checklist = await Checklist.getByTaskId(task.id);
                progress = await Checklist.calculateProgress(task.id);
            }

            return { ...task, checklist, progress };
        }));
        
        return tasksWithDetails;
    }

    /**
     * Delete a task by ID.
     * @param {number} id 
     */
    static async delete(id) {
        logger.info(`Deleting task ${id}`);
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    }

    /**
     * Update a task's basic fields by ID.
     * @param {number} id
     * @param {Object} data
     */
    static async update(id, data) {
        logger.info(`Updating task ${id}`);
        const fields = [];
        const values = [];
        
        if (data.title !== undefined) {
            fields.push('title = ?');
            values.push(data.title);
        }
        if (data.target_time !== undefined) {
            fields.push('target_time = ?');
            values.push(data.target_time);
        }
        if (data.buffer_minutes !== undefined) {
            fields.push('buffer_minutes = ?');
            values.push(data.buffer_minutes);
        }
        if (data.due_date !== undefined) {
            fields.push('due_date = ?');
            values.push(data.due_date);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }

        if (fields.length === 0) return;

        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(query, values);
    }
}

module.exports = BaseTask;
