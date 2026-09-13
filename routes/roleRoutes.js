const express = require('express');
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Role = require('../models/Role');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    authorize('super_admin'),
    advancedResults(Role),
    getRoles
  )
  .post(authorize('super_admin'), createRole);

router
  .route('/:id')
  .get(authorize('super_admin'), getRole)
  .put(authorize('super_admin'), updateRole)
  .delete(authorize('super_admin'), deleteRole);

module.exports = router;