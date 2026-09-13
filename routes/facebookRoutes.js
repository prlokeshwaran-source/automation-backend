const express = require('express');
const {
  getFacebookConfigs,
  getFacebookConfig,
  createFacebookConfig,
  updateFacebookConfig,
  deleteFacebookConfig,
  getFacebookPages,
  savePageToken,
} = require('../controllers/facebookController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const FacebookConfig = require('../models/FacebookConfig');

const router = express.Router();

router.use(protect);

router
  .route('/config')
  .get(
    advancedResults(FacebookConfig, ['organization']),
    getFacebookConfigs
  )
  .post(createFacebookConfig);

router
  .route('/config/:id')
  .get(getFacebookConfig)
  .put(updateFacebookConfig)
  .delete(authorize('admin', 'super_admin'), deleteFacebookConfig);

router.route('/pages/:orgId').get(getFacebookPages);
router.route('/pages/save').post(savePageToken);

module.exports = router;