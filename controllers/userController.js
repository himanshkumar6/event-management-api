const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required and must be a valid string.' });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: 'Email is required and must be a valid string.' });
    }

    const id = uuidv4();
    await userModel.createUser({ id, name, email });
    
    res.status(201).json({ id });

  } catch (err) {
    console.error('❌ Internal Server ERROR:', err);
    res.status(500).json({ message: 'Something went wrong on server. Please try again later.' });
  }
};

module.exports = { createUser };
