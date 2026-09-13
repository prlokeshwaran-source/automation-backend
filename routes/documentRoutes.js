const express = require('express');
const {
  getDocumentVerifications,
  getDocumentVerification,
  createDocumentVerification,
  updateDocumentVerification,
  approveDocument,
  rejectDocument,
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const DocumentVerification = require('../models/DocumentVerification');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(
    advancedResults(DocumentVerification, ['organization user verifiedBy']),
    getDocumentVerifications
  )
  .post(createDocumentVerification);

router
  .route('/:id')
  .get(getDocumentVerification)
  .put(updateDocumentVerification);

router.route('/:id/approve').put(authorize('admin', 'super_admin'), approveDocument);
router.route('/:id/reject').put(authorize('admin', 'super_admin'), rejectDocument);

module.exports = router;