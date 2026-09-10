const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  assignLead,
  addNote,
  getLeadStats,
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Lead = require('../models/Lead');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    advancedResults(Lead, ['organization campaign page assignedTo notes.createdBy']),
    getLeads
  )
  .post(createLead);

router
  .route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('admin', 'super_admin'), deleteLead);

router.route('/:id/assign').put(assignLead);
router.route('/:id/note').post(addNote);
router.route('/stats/:orgId').get(getLeadStats);

module.exports = router;