import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true },
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

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;