const mongoose = require('mongoose');

const fanSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  walletAddress: { type: String },
  spotifyId: { type: String },
  spotifyAccessToken: { type: String },
  listeningTime: { type: Number, default: 0 },
  priorityQueue: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      position: { type: Number },
    },
  ],
});

module.exports = mongoose.model('Fan', fanSchema);