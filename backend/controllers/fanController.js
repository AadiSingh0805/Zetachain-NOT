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

// Get a single fan by ID
export const getFanById = async (req, res) => {
  try {
    const fan = await Fan.findById(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a fan by ID
export const updateFan = async (req, res) => {
  try {
    const fan = await Fan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a fan by ID
export const deleteFan = async (req, res) => {
  try {
    const fan = await Fan.findByIdAndDelete(req.params.id);
    if (!fan) return res.status(404).json({ message: 'Fan not found' });
    res.status(200).json({ message: 'Fan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};