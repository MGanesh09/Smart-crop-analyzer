const express = require('express');
const router = express.Router();
const {
  getCropPrices,
  calculateProfit,
  getAlerts,
} = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

// Secure all market routes
router.use(protect);

router.get('/prices', getCropPrices);
router.post('/calculate-profit', calculateProfit);
router.get('/alerts', getAlerts);

module.exports = router;
