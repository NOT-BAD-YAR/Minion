const express = require('express');
const router = express.Router();
const SmallTaskController = require('../controllers/smallTaskController');
const DailyTaskController = require('../controllers/dailyTaskController');
const LongTaskController = require('../controllers/longTaskController');
const ChecklistController = require('../controllers/checklistController');

router.get('/small', SmallTaskController.getAll);
router.post('/small', SmallTaskController.create);
router.put('/small/:id', SmallTaskController.update);
router.delete('/small/:id', SmallTaskController.delete);

router.get('/daily', DailyTaskController.getAll);
router.post('/daily', DailyTaskController.create);
router.put('/daily/:id', DailyTaskController.update);
router.delete('/daily/:id', DailyTaskController.delete);
router.post('/daily/reset', DailyTaskController.reset);
router.get('/daily/:id/streak', DailyTaskController.getStreak);

router.get('/long', LongTaskController.getAll);
router.post('/long', LongTaskController.create);
router.put('/long/:id', LongTaskController.update);
router.delete('/long/:id', LongTaskController.delete);

router.put('/checklist/:itemId', ChecklistController.toggle);

const ProgressController = require('../controllers/progressController');
router.get('/progress', ProgressController.getDailyProgress);

module.exports = router;
