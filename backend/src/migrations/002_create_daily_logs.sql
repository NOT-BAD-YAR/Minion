-- Add status column to tasks to allow marking Small Tasks as completed
ALTER TABLE tasks ADD COLUMN status VARCHAR(20) DEFAULT 'PENDING';

-- Create table to track daily completions of checklist items
CREATE TABLE IF NOT EXISTS daily_log_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    checklist_item_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (checklist_item_id) REFERENCES checklist_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_daily_item (date, checklist_item_id)
);
