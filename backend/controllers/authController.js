import supabase from '../db/supabaseClient.js';
import Fan from '../models/fanModel.js';
import Artist from '../models/artistModel.js';

export const signup = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  // Create user in Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const supabaseId = data.user.id; // Supabase user ID

  try {
    // Store basic user data in MongoDB
    if (role === 'fan') {
      const fan = await Fan.create({
        supabaseId,
        email,
      });
      return res.status(201).json({ message: 'Fan registered successfully', fan });
    } else if (role === 'artist') {
      const artist = await Artist.create({
        supabaseId,
        email,
      });
      return res.status(201).json({ message: 'Artist registered successfully', artist });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Authenticate user with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const supabaseId = data.user.id; // Supabase user ID

  try {
    // Fetch user data from MongoDB
    const fan = await Fan.findOne({ supabaseId });
    if (fan) {
      return res.status(200).json({ role: 'fan', data: fan });
    }

    const artist = await Artist.findOne({ supabaseId });
    if (artist) {
      return res.status(200).json({ role: 'artist', data: artist });
    }

    return res.status(404).json({ error: 'User not found in MongoDB' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
