const express = require('express');
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Organization = require('../models/Organization');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    authorize('super_admin'),
    advancedResults(Organization, ['admin']),
    getOrganizations
  )
  .post(authorize('super_admin'), createOrganization);

router
  .route('/:id')
  .get(authorize('super_admin', 'admin'), getOrganization)
  .put(authorize('super_admin'), updateOrganization)
  .delete(authorize('super_admin'), deleteOrganization);

module.exports = router;