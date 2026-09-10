const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    authorize('admin', 'super_admin'),
    advancedResults(User, ['organization']),
    getUsers
  )
  .post(authorize('admin', 'super_admin'), createUser);

router
  .route('/:id')
  .get(authorize('admin', 'super_admin'), getUser)
  .put(authorize('admin', 'super_admin'), updateUser)
  .delete(authorize('admin', 'super_admin'), deleteUser);

module.exports = router;