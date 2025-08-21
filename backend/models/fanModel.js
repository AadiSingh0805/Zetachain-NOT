import mongoose from 'mongoose';

const fanSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String }, // Optional, can be added later
  walletAddress: { type: String }, // Optional, can be added later
  spotifyId: { type: String }, // Optional, can be added later
  listeningTime: { type: Number, default: 0 },
  priorityQueue: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      position: { type: Number },
    },
  ],
});

export default mongoose.model('Fan', fanSchema);