import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ownerAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  ticketType: {
    type: String,
    enum: ['General', 'VIP', 'Early Bird'],
    default: 'General'
  },
  seatNumber: String,
  mintedAt: {
    type: Date,
    default: Date.now
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
ticketSchema.index({ tokenId: 1 });
ticketSchema.index({ ownerAddress: 1 });
ticketSchema.index({ eventId: 1 });

export default mongoose.model('Ticket', ticketSchema);