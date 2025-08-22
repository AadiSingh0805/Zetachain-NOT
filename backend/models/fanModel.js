const mongoose = require('mongoose');

const fanSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  walletAddress: { type: String },
  spotifyId: { type: String },
  spotifyAccessToken: { type: String },
  listeningTime: { type: Number, default: 0 },
  
  // Spotify authentication tokens
  spotifyAccessToken: { type: String },
  spotifyRefreshToken: { type: String },
  
  priorityQueue: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      position: { type: Number },
      priorityScore: { type: Number, default: 0 },
      joinedAt: { type: Date, default: Date.now }
    },
  ],
}, {
  timestamps: true
});

module.exports = mongoose.model('Fan', fanSchema);