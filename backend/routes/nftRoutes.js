import express from 'express';
import Ticket from '../models/ticketModel.js';
import Event from '../models/eventModel.js';

const router = express.Router();

// NFT Metadata endpoint
router.get('/metadata/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    // Find ticket and populate event details
    const ticket = await Ticket.findOne({ tokenId })
      .populate('eventId')
      .exec();

    if (!ticket) {
      return res.status(404).json({ error: "Token not found" });
    }

    const event = ticket.eventId;
    
    // Return OpenSea-compatible NFT metadata
    res.json({
      name: `${event.title} - Ticket #${tokenId}`,
      description: `Concert ticket for ${event.title} by ${event.artist}. ${event.description}`,
      image: event.imageUrl || `${process.env.BASE_URL}/api/images/default-ticket.png`,
      external_url: `${process.env.FRONTEND_URL}/ticket/${tokenId}`,
      attributes: [
        {
          trait_type: "Artist",
          value: event.artist
        },
        {
          trait_type: "Event",
          value: event.title
        },
        {
          trait_type: "Venue", 
          value: event.venue
        },
        {
          trait_type: "Date",
          value: event.date.toLocaleDateString()
        },
        {
          trait_type: "Ticket Type",
          value: ticket.ticketType
        },
        {
          trait_type: "Seat Number",
          value: ticket.seatNumber || "General Admission"
        }
      ],
      background_color: "000000"
    });

  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create ticket when NFT is minted
router.post('/tickets', async (req, res) => {
  try {
    const { tokenId, eventId, ownerAddress, ticketType, seatNumber } = req.body;

    const ticket = new Ticket({
      tokenId,
      eventId,
      ownerAddress: ownerAddress.toLowerCase(),
      ticketType,
      seatNumber
    });

    await ticket.save();
    
    // Populate event details for response
    await ticket.populate('eventId');

    res.json({ success: true, ticket });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Token ID already exists" });
    }
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all tickets for a user
router.get('/tickets/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;

    const tickets = await Ticket.find({ 
      ownerAddress: address.toLowerCase() 
    })
    .populate('eventId')
    .sort({ mintedAt: -1 });

    res.json(tickets);

  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update ticket owner (when NFT is transferred)
router.put('/tickets/:tokenId/owner', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { newOwnerAddress } = req.body;

    const ticket = await Ticket.findOneAndUpdate(
      { tokenId },
      { ownerAddress: newOwnerAddress.toLowerCase() },
      { new: true }
    ).populate('eventId');

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ success: true, ticket });

  } catch (error) {
    console.error('Error updating ticket owner:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;