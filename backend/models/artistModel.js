import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String }, // Optional, can be added later
  walletAddress: { type: String }, // Optional, can be added later
  events: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
      name: { type: String },
      date: { type: Date },
      seatCount: { type: Number },
      price: { type: Number },
    },
  ],
});

export default mongoose.model('Artist', artistSchema);