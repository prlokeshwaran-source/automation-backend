const express = require('express');
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  approveCampaign,
  pauseCampaign,
  resumeCampaign,
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Campaign = require('../models/Campaign');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    advancedResults(Campaign, [
      { path: 'organization pages createdBy approvedBy' },
    ]),
    getCampaigns
  )
  .post(createCampaign);

router
  .route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(authorize('admin', 'super_admin'), deleteCampaign);

router.route('/:id/approve').put(authorize('admin', 'super_admin'), approveCampaign);
router.route('/:id/pause').put(pauseCampaign);
router.route('/:id/resume').put(resumeCampaign);

module.exports = router;