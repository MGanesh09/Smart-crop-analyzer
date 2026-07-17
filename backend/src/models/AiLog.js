const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['disease', 'pest', 'fertilizer', 'soil', 'irrigation', 'yield', 'chat'],
      required: true,
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    resultData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AiLog', aiLogSchema);
