const express = require('express');
const router = express.Router();
const {
  getFarms,
  getFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  uploadFarmImage,
} = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHelper');

// Secure all routes
router.use(protect);

router
  .route('/')
  .get(getFarms)
  .post(createFarm);

router
  .route('/:id')
  .get(getFarm)
  .put(updateFarm)
  .delete(deleteFarm);

router.post('/upload', upload.single('image'), uploadFarmImage);

module.exports = router;
