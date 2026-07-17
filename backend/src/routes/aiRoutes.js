const express = require('express');
const router = express.Router();
const {
  detectDisease,
  detectPest,
  getFertilizerAdvice,
  analyzeSoilHealth,
  getIrrigationSchedule,
  predictYield,
  chatAgronomist,
  getWeather,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadHelper');

// Secure all AI routes
router.use(protect);

router.post('/disease-detect', upload.single('image'), detectDisease);
router.post('/pest-detect', upload.single('image'), detectPest);
router.post('/fertilizer', getFertilizerAdvice);
router.post('/soil-health', analyzeSoilHealth);
router.post('/irrigation', getIrrigationSchedule);
router.post('/yield-predict', predictYield);
router.post('/chat', chatAgronomist);
router.get('/weather', getWeather);

module.exports = router;
