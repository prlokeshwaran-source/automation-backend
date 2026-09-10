const express = require('express');
const {
  getNotifications,
  getNotification,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Notification = require('../models/Notification');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    advancedResults(Notification, ['organization', 'recipient']),
    getNotifications
  )
  .post(createNotification);

router
  .route('/:id')
  .get(getNotification)
  .delete(deleteNotification);

router.route('/:id/read').put(markNotificationAsRead);

module.exports = router;