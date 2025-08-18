import Fan from '../models/fanModel.js';

// Create a new fan
export const createFan = async (req, res) => {
  try {
    const fan = new Fan(req.body);
    await fan.save();
    res.status(201).json(fan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all fans
export const getFans = async (req, res) => {
  try {
    const fans = await Fan.find();
    res.status(200).json(fans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};