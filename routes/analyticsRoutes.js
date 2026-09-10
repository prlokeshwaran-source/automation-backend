const express = require('express');
const {
  getDashboardStats,
  getCampaignAnalytics,
  getLeadAnalytics,
  getOperationalSignals,
  exportData,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/dashboard/:orgId').get(getDashboardStats);
router.route('/campaign/:campaignId').get(getCampaignAnalytics);
router.route('/leads/:orgId').get(getLeadAnalytics);
router.route('/signals/:orgId').get(getOperationalSignals);
router.route('/export/:orgId').get(exportData);

module.exports = router;