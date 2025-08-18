import mongoose from 'mongoose';

const fanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  spotifyId: { type: String, required: true },
  walletAddress: { type: String, required: true },
  listeningTime: { type: Number, default: 0 },
  priorityQueue: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      position: { type: Number },
    },
  ],
});

const Fan = mongoose.model('Fan', fanSchema);

export default Fan;