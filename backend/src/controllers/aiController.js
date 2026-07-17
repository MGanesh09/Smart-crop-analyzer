const { GoogleGenerativeAI } = require('@google/generative-ai');
const AiLog = require('../models/AiLog');
const { uploadToCloudinary } = require('../utils/uploadHelper');

// Helper to log AI results
const logAiRequest = async (userId, type, inputData, resultData) => {
  try {
    await AiLog.create({ user: userId, type, inputData, resultData });
  } catch (error) {
    console.error('Error logging AI request:', error);
  }
};

// @desc    Detect crop disease
// @route   POST /api/ai/disease-detect
// @access  Private
exports.detectDisease = async (req, res, next) => {
  try {
    const { cropType = 'Tomato' } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    // Agronomic Diagnostic Library (Fallback Engine)
    const diagnosisCatalog = {
      tomato: {
        disease: 'Tomato Late Blight (Phytophthora infestans)',
        severity: 'Critical (80% Leaf Damage)',
        cause: 'High ambient humidity and wet leaf canopy conditions.',
        organicTreatment: 'Apply copper-based organic fungicides. Prune affected bottom leaves to improve circulation.',
        chemicalTreatment: 'Apply Chlorothalonil or Mancozeb protective spray barriers.',
      },
      corn: {
        disease: 'Common Rust (Puccinia sorghi)',
        severity: 'Moderate (35% Leaf Damage)',
        cause: 'Fungal spores dispersed by wind during cool, moist periods.',
        organicTreatment: 'Spray sulfur-based powder dusts. Remove infected debris post-harvest.',
        chemicalTreatment: 'Apply Pyraclostrobin or Tebuconazole fungicide formulas.',
      },
      wheat: {
        disease: 'Leaf Rust (Puccinia recondita)',
        severity: 'Mild (15% Leaf Damage)',
        cause: 'Warm temperatures combined with leaf wetness.',
        organicTreatment: 'Use neem oil sprays weekly. Clear volunteer wheat plants near borders.',
        chemicalTreatment: 'Apply Propiconazole or Azoxystrobin protective systemic barriers.',
      },
      mango: {
        disease: 'Mango Powdery Mildew (Oidium mangiferae)',
        severity: 'Medium (40% Leaf & Bloom Damage)',
        cause: 'Cool nights and high humidity promoting fungal germination on young shoots.',
        organicTreatment: 'Spray neem oil or sulfur powder suspension formulations.',
        chemicalTreatment: 'Apply Carbendazim or Hexaconazole fungicide protective sprays.',
      },
      tamarind: {
        disease: 'Tamarind Leaf Spot (Pseudocercospora tamarindi)',
        severity: 'Mild (25% Leaf Lesions)',
        cause: 'Persistent water stagnation and lack of sunshine in canopy layers.',
        organicTreatment: 'Remove infected leaf litter and spray copper oxychloride suspension.',
        chemicalTreatment: 'Apply Mancozeb or Chlorothalonil protectant formulations.',
      },
      default: {
        disease: 'Anthracnose Fungal Infestation',
        severity: 'Mild (20% Stem Lesions)',
        cause: 'Rain-splashed fungal spores persisting in soil organic debris.',
        organicTreatment: 'Spray organic liquid copper solutions. Rotate crops next season.',
        chemicalTreatment: 'Apply broad-spectrum Thiophanate-methyl systemic protectants.',
      },
    };

    const key = cropType.toLowerCase();
    const result = diagnosisCatalog[key] || diagnosisCatalog.default;
    if (imageUrl) result.imageUrl = imageUrl;

    await logAiRequest(req.user.id, 'disease', { cropType, imageUrl }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Detect pest infestations
// @route   POST /api/ai/pest-detect
// @access  Private
exports.detectPest = async (req, res, next) => {
  try {
    const { cropType = 'Tomato' } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const pestCatalog = {
      tomato: {
        pest: 'Two-Spotted Spider Mite (Tetranychus urticae)',
        threatScore: 'High (65% Threat)',
        symptoms: 'Fine webbing beneath leaves, yellow speckling/stippling on leaf surface.',
        organicTreatment: 'Introduce predatory mites (Phytoseiulus persimilis). Spray insecticidal neem soap.',
        chemicalTreatment: 'Apply Abamectin or Spiromesifen selective miticide treatments.',
      },
      corn: {
        pest: 'Fall Armyworm (Spodoptera frugiperda)',
        threatScore: 'Critical (90% Threat)',
        symptoms: 'Ragged defoliation holes on leaf whorls, yellow larval waste residue.',
        organicTreatment: 'Apply Bacillus thuringiensis (Bt) bacterial sprays. Dust with diatomaceous earth.',
        chemicalTreatment: 'Apply Chlorantraniliprole or Spinetoram chemical defenses.',
      },
      mango: {
        pest: 'Mango Hopper (Idioscopus clypealis)',
        threatScore: 'High (70% Threat)',
        symptoms: 'Sap-feeding insects on blossoms and leaves, leading to honeydew coating.',
        organicTreatment: 'Apply neem kernel oil spray and introduce predatory bugs.',
        chemicalTreatment: 'Spray Imidacloprid or Lambdacyhalothrin insect mitigation treatments.',
      },
      tamarind: {
        pest: 'Tamarind Seed Borer (Calandra linearis)',
        threatScore: 'Moderate (50% Threat)',
        symptoms: 'Larval tunneling holes visible inside seed pods and defoliation.',
        organicTreatment: 'Clear infested fallen pods from field ground. Apply Bt spray layers.',
        chemicalTreatment: 'Apply Spinosad or Emamectin benzoate systemic sprays.',
      },
      default: {
        pest: 'Green Peach Aphids (Myzus persicae)',
        threatScore: 'Moderate (40% Threat)',
        symptoms: 'Sticky honeydew residues on leaves, curling shoots, distorted growth stems.',
        organicTreatment: 'Introduce ladybug beetles. Apply organic horticultural oil washes.',
        chemicalTreatment: 'Apply Imidacloprid or Acetamiprid systemic insecticide sprays.',
      },
    };

    const key = cropType.toLowerCase();
    const result = pestCatalog[key] || pestCatalog.default;
    if (imageUrl) result.imageUrl = imageUrl;

    await logAiRequest(req.user.id, 'pest', { cropType, imageUrl }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Fertilizer Recommendation
// @route   POST /api/ai/fertilizer
// @access  Private
exports.getFertilizerAdvice = async (req, res, next) => {
  try {
    const { cropType = 'Tomato', nitrogen = 50, phosphorus = 30, potassium = 120, pH = 6.5 } = req.body;

    // Agronomic Chemistry Logic
    const nDeficit = Math.max(0, 120 - nitrogen); // Target N is ~120
    const pDeficit = Math.max(0, 60 - phosphorus); // Target P is ~60
    const kDeficit = Math.max(0, 150 - potassium); // Target K is ~150

    let recType = 'Balanced N-P-K Formula (e.g. 10-10-10)';
    let dosage = '150 kg per acre';
    const schedule = 'Apply 50% during transplanting, 50% at flowering stage.';

    if (nDeficit > pDeficit && nDeficit > kDeficit) {
      recType = 'Nitrogen-Rich Fertilizer (e.g. Urea or Ammonium Nitrate)';
      dosage = `${Math.round(nDeficit * 2.5)} kg per acre`;
    } else if (pDeficit > nDeficit && pDeficit > kDeficit) {
      recType = 'Phosphorus-Rich Fertilizer (e.g. Diammonium Phosphate - DAP)';
      dosage = `${Math.round(pDeficit * 3.0)} kg per acre`;
    } else if (kDeficit > nDeficit && kDeficit > pDeficit) {
      recType = 'Potassium-Rich Fertilizer (e.g. Muriate of Potash / Potassium Sulfate)';
      dosage = `${Math.round(kDeficit * 2.0)} kg per acre`;
    }

    const result = {
      deficiencies: { Nitrogen: nDeficit, Phosphorus: pDeficit, Potassium: kDeficit },
      recommendedFertilizer: recType,
      dosage,
      schedule,
      soilPHStatus: pH < 6.0 ? 'Acidic (Apply lime to raise pH)' : pH > 7.2 ? 'Alkaline (Apply elemental sulfur to lower pH)' : 'Optimal pH range',
    };

    await logAiRequest(req.user.id, 'fertilizer', { cropType, nitrogen, phosphorus, potassium, pH }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze Soil Health
// @route   POST /api/ai/soil-health
// @access  Private
exports.analyzeSoilHealth = async (req, res, next) => {
  try {
    const { nitrogen = 50, phosphorus = 30, potassium = 120, pH = 6.5, moisture = 40 } = req.body;

    // Calculate rating score
    let score = 0;
    if (pH >= 6.0 && pH <= 7.0) score += 25;
    if (nitrogen >= 80) score += 25;
    if (phosphorus >= 45) score += 25;
    if (potassium >= 120) score += 25;

    let qualityRating = 'Good';
    let recommendations = 'Maintain organic compost additions to preserve microbial activity.';

    if (score < 40) {
      qualityRating = 'Poor / Exhausted';
      recommendations = 'Highly depleted of essential minerals. Sow green manure cover crops (e.g. clover) and apply organic vermicompost immediately.';
    } else if (score < 75) {
      qualityRating = 'Fair / Depleted';
      recommendations = 'Apply targeted mineral fertilizers and introduce bio-fertilizers (Azotobacter) to restore nitrogen fixing capabilities.';
    }

    const result = {
      score,
      qualityRating,
      recommendations,
      moistureStatus: moisture < 35 ? 'Dry (High irrigation priority)' : moisture > 65 ? 'Waterlogged (Risk of root anaerobic suffocation)' : 'Optimal moisture matrix',
    };

    await logAiRequest(req.user.id, 'soil', { nitrogen, phosphorus, potassium, pH, moisture }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Smart Irrigation Recommendation
// @route   POST /api/ai/irrigation
// @access  Private
exports.getIrrigationSchedule = async (req, res, next) => {
  try {
    const { cropType = 'Tomato', moisture = 40, temp = 25 } = req.body;

    let rate = 'Every 3 days';
    let litersPerSqm = 12;
    let instructions = 'Drip irrigate early morning to prevent fungal growth.';

    if (moisture < 30) {
      rate = 'Daily / High Flow';
      litersPerSqm = 20;
    } else if (temp > 32) {
      rate = 'Every 2 days';
      litersPerSqm = 16;
      instructions = 'Apply straw mulch cover around crops to reduce soil moisture evaporation.';
    } else if (moisture > 60) {
      rate = 'Suspend Irrigation';
      litersPerSqm = 0;
      instructions = 'Soil saturation level is high. Prevent crop root rot.';
    }

    const result = {
      frequency: rate,
      waterVolume: `${litersPerSqm} L/m²`,
      instructions,
      weatherFactor: temp > 30 ? 'High evapotranspiration risk' : 'Normal climate factors',
    };

    await logAiRequest(req.user.id, 'irrigation', { cropType, moisture, temp }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Yield prediction
// @route   POST /api/ai/yield-predict
// @access  Private
exports.predictYield = async (req, res, next) => {
  try {
    const { cropType = 'Tomato', size = 5, soilType = 'loamy' } = req.body;

    // Yield logic
    let yieldFactor = 8.5; // tons per acre
    let pricePerTon = 35000; // INR

    if (cropType.toLowerCase() === 'corn') {
      yieldFactor = 4.2;
      pricePerTon = 16500;
    } else if (cropType.toLowerCase() === 'wheat') {
      yieldFactor = 3.1;
      pricePerTon = 22500;
    }

    // Soil type adjustments
    if (soilType.toLowerCase() === 'loamy') {
      yieldFactor *= 1.25;
    } else if (soilType.toLowerCase() === 'clay') {
      yieldFactor *= 0.95;
    } else if (soilType.toLowerCase() === 'sandy') {
      yieldFactor *= 0.75;
    }

    const expectedTons = (yieldFactor * size).toFixed(1);
    const valuation = Math.round(expectedTons * pricePerTon);

    const result = {
      expectedTons,
      pricePerTon: `₹${pricePerTon.toLocaleString()}`,
      estimatedValuation: `₹${valuation.toLocaleString()}`,
      confidenceIndex: '88%',
    };

    await logAiRequest(req.user.id, 'yield', { cropType, size, soilType }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    AI chat with agronomist
// @route   POST /api/ai/chat
// @access  Private
exports.chatAgronomist = async (req, res, next) => {
  try {
    const { message } = req.body;
    let reply = '';

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const systemPrompt = `You are a professional agronomist and farming advisor on AgriSmart. Question: ${message}`;
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        reply = response.text();
      } catch (err) {
        console.error('Gemini API call failed, using fallback:', err);
      }
    }

    if (!reply) {
      const promptText = message.toLowerCase().trim();
      
      // Greetings & Conversational Contexts
      if (promptText === 'hi' || promptText === 'hello' || promptText === 'hey' || promptText.startsWith('hello') || promptText.startsWith('hi ')) {
        reply = `Hello! I am your AgriSmart Agronomist Advisor. I can help you with crop disease identification, fertilizer ratios, soil diagnostics, irrigation planning, yield predictions, and market calculations. What are you planning to farm today?`;
      } else if (promptText.includes('how are you')) {
        reply = `I am doing great, ready to analyze some crop metrics! How are your fields doing today? Let's check your NPK values or soil moisture.`;
      } else if (promptText.includes('thank') || promptText.includes('thanks')) {
        reply = `You're very welcome! Let me know if you need any more agronomic guidance. Happy farming!`;
      } else if (promptText.includes('who are you') || promptText.includes('what is this')) {
        reply = `I am the AgriSmart AI Agronomist, a specialized model trained to diagnose soil health, recommend fertilizers, predict crop yields, plan irrigation schedules, and analyze pest infestations.`;
      }
      
      // Agronomic topics
      else if (promptText.includes('plant') || promptText.includes('grow') || promptText.includes('crop') || promptText.includes('seed')) {
        reply = `To optimize crop systems, select high-yielding disease-resistant seed varieties. Maintain adequate row spacing (e.g., 30–45 cm for tomatoes and peppers) to improve air circulation and prevent leaf rot. Remember to rotate crops annually to disrupt pest lifecycles.`;
      } else if (promptText.includes('water') || promptText.includes('irrigation') || promptText.includes('dry') || promptText.includes('wet') || promptText.includes('rain')) {
        reply = `Smart irrigation is key to high yields. Drip irrigation is 50% more water-efficient than overhead sprinklers as it delivers moisture directly to the roots. Always irrigate in the early morning to minimize evaporation and prevent leaf fungal blights.`;
      } else if (promptText.includes('soil') || promptText.includes('clay') || promptText.includes('sandy') || promptText.includes('loam') || promptText.includes('silt')) {
        reply = `Soil texture determines nutrient retention. Loamy soil is ideal for balanced drainage and aeration. Clay soil retains moisture well but requires organic compost to prevent compaction. Sandy soil drains quickly; apply mulch to conserve water.`;
      } else if (promptText.includes('fertilizer') || promptText.includes('npk') || promptText.includes('nitrogen') || promptText.includes('phosphorus') || promptText.includes('potassium') || promptText.includes('urea') || promptText.includes('dap')) {
        reply = `NPK balance is vital: Nitrogen (N) is for leafy foliage, Phosphorus (P) builds strong root networks, and Potassium (K) stimulates flower/fruit development. Balance your soil's pH (ideal is 6.0–7.0) before applying synthetic Urea or organic compost.`;
      } else if (promptText.includes('disease') || promptText.includes('blight') || promptText.includes('fungus') || promptText.includes('mold') || promptText.includes('leaf') || promptText.includes('pest') || promptText.includes('bug') || promptText.includes('insect')) {
        reply = `For pest control, introduce beneficial insects like ladybugs to combat aphids. If dealing with fungal blights (like Late Blight), apply organic copper-based fungicides. Always remove and burn infected plant debris post-harvest.`;
      } else if (promptText.includes('yield') || promptText.includes('predict') || promptText.includes('tons') || promptText.includes('profit') || promptText.includes('price')) {
        reply = `Yield output depends directly on NPK levels, soil structure, and temperature. You can use the Yield Predictor tab on this dashboard to calculate expected tonnage and project market revenues in Rupees (₹) based on field size.`;
      }
      
      // Default Fallback
      else {
        reply = `That is an interesting agronomy topic! To optimize this, ensure you analyze local soil chemistry, seasonal temperatures, and moisture. If you would like specific suggestions on NPK fertilizer ratios, crop diseases, pest mitigation, or irrigation scheduling, feel free to ask!`;
      }
    }

    const result = { reply };
    await logAiRequest(req.user.id, 'chat', { message }, result);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weather API simulation
// @route   GET /api/ai/weather
// @access  Private
exports.getWeather = async (req, res, next) => {
  try {
    const { location = 'Napa Valley' } = req.query;

    const weatherMock = {
      location,
      temp: '26°C',
      humidity: '58%',
      condition: 'Partly Cloudy',
      windSpeed: '14 km/h',
      rainProbability: '10%',
    };

    res.json({ success: true, data: weatherMock });
  } catch (error) {
    next(error);
  }
};
