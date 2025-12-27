const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Routes feedback
router.post('/api/feedback', feedbackController.createFeedback);
router.get('/api/feedback', feedbackController.getAllFeedback);
router.get('/api/feedback/unread', feedbackController.getUnreadFeedback);
router.get('/api/feedback/count', feedbackController.countUnreadFeedback);
router.put('/api/feedback/read/:id', feedbackController.markAsRead);
router.put('/api/feedback/readall', feedbackController.markAllAsRead);
router.delete('/api/feedback/:id', feedbackController.deleteFeedback);

module.exports = router;
