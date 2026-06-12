const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// HTTP request logger middleware
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
    logger.info('Health check endpoint called');
    res.json({ status: 'OK', message: 'Minion Backend is running!' });
});

// Use modular routes
const routes = require('./routes');
app.use('/api/tasks', routes);

// Centralized error handler middleware (must be defined last)
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
