// @desc    Get crop market prices & predictions
// @route   GET /api/market/prices
// @access  Private
exports.getCropPrices = async (req, res, next) => {
  try {
    // Generate realistic historical pricing (past 6 months) and 30-day forecast
    const crops = ['Tomato', 'Corn', 'Wheat'];
    const historicalData = {};

    crops.forEach((crop) => {
      let basePrice = crop === 'Tomato' ? 35000 : crop === 'Corn' ? 16500 : 22500;
      const history = [];
      const forecast = [];

      // Generate 6 months of historical data points (roughly 12 points, bi-weekly)
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 14);
        
        // Random fluctuation between -10% and +10%
        const fluctuation = 1 + (Math.random() * 0.2 - 0.1);
        const price = Math.round(basePrice * fluctuation);

        history.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price,
        });
      }

      // Generate 30 days forecast (3 points, 10 days intervals)
      for (let i = 1; i <= 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i * 10);
        
        // Trend slightly upwards (simulating smart farming market gains)
        const fluctuation = 1 + (Math.random() * 0.1) + (i * 0.02);
        const price = Math.round(basePrice * fluctuation);

        forecast.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price,
        });
      }

      historicalData[crop] = { history, forecast, currentPrice: history[history.length - 1].price };
    });

    res.json({ success: true, data: historicalData });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate farm operational profits
// @route   POST /api/market/calculate-profit
// @access  Private
exports.calculateProfit = async (req, res, next) => {
  try {
    const { 
      cropType = 'Tomato', 
      size = 5, 
      seedCost = 4000, 
      fertilizerCost = 6000, 
      laborCost = 10000, 
      waterCost = 3000 
    } = req.body;

    let yieldFactor = 8.5; // tons per acre
    let pricePerTon = 35000; // INR

    if (cropType.toLowerCase() === 'corn') {
      yieldFactor = 4.2;
      pricePerTon = 16500;
    } else if (cropType.toLowerCase() === 'wheat') {
      yieldFactor = 3.1;
      pricePerTon = 22500;
    }

    const expectedTons = yieldFactor * size;
    const grossRevenue = Math.round(expectedTons * pricePerTon);

    // Calculate operational costs (per acre basis)
    const totalSeed = seedCost * size;
    const totalFertilizer = fertilizerCost * size;
    const totalLabor = laborCost * size;
    const totalWater = waterCost * size;
    const totalCosts = totalSeed + totalFertilizer + totalLabor + totalWater;

    const netProfit = grossRevenue - totalCosts;

    res.json({
      success: true,
      data: {
        expectedYieldTons: expectedTons.toFixed(1),
        grossRevenue,
        costs: {
          seeds: totalSeed,
          fertilizer: totalFertilizer,
          labor: totalLabor,
          water: totalWater,
          total: totalCosts,
        },
        netProfit,
        roi: totalCosts > 0 ? ((netProfit / totalCosts) * 100).toFixed(1) + '%' : '0%',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weather alerts & notifications
// @route   GET /api/market/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = [
      {
        id: '1',
        title: 'Frost Warning Indicator',
        description: 'Temperatures are projected to drop to 2°C in the Napa Valley area. Cover sensitive canopy crops.',
        severity: 'critical',
        date: 'Today',
      },
      {
        id: '2',
        title: 'Optimal Moisture Window',
        description: 'Expected rain threshold of 15mm tomorrow. Delay active irrigation schedules by 24 hours.',
        severity: 'info',
        date: 'Tomorrow',
      },
      {
        id: '3',
        title: 'Nitrogen Depletion Alert',
        description: 'Oakridge Field sensor readings reflect Nitrogen levels below 40 mg/kg. Schedule topdressing.',
        severity: 'warning',
        date: 'Yesterday',
      },
    ];

    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
};
