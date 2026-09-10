const express = require('express');
const {
  getSettings,
  getSettingByKey,
  createSetting,
  updateSetting,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const SystemSettings = require('../models/SystemSettings');

const router = express.Router();

router.use(protect);
router.use(authorize('super_admin'));

router
  .route('/')
  .get(advancedResults(SystemSettings), getSettings)
  .post(createSetting);

router
  .route('/:key')
  .get(getSettingByKey)
  .put(updateSetting);

module.exports = router;