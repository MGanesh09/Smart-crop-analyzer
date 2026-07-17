const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a farm name'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    locationName: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0, // in acres
    },
    boundary: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
    soil: {
      type: {
        type: String,
        enum: ['clay', 'sandy', 'silty', 'loamy', 'peaty', 'chalky'],
        default: 'loamy',
      },
      pH: { type: Number, default: 6.5 },
      moisture: { type: Number, default: 40 }, // in percentage
      nitrogen: { type: Number, default: 50 }, // in mg/kg
      phosphorus: { type: Number, default: 30 }, // in mg/kg
      potassium: { type: Number, default: 120 }, // in mg/kg
    },
    crops: [
      {
        name: { type: String, required: true },
        status: {
          type: String,
          enum: ['planted', 'growing', 'harvestable', 'harvested'],
          default: 'planted',
        },
        plantingDate: { type: Date, default: Date.now },
        expectedHarvestDate: { type: Date },
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', farmSchema);
