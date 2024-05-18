const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const accessToken = jwt.sign({ id: user.id },"JWT_SECRET", { expiresIn: '1h' });
    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 3600000 
    });

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    res.json({ user: userWithoutPassword ,token:accessToken});
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUser(req, res) {
  try {
    const {token} = req.body;
    if (!token) {
      return res.status(200).json({ message: 'No token available.', user: null });
    }

    jwt.verify(token, "JWT_SECRET", async (err, decoded) => {
      if (err) {
        return res.status(200).json({ message: 'Invalid token.', user: null });
      }
      
      const userId = decoded.id;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found.', user: null });
      }
      
      return res.status(200).json({ message: 'User found.', user: user });
    });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { register, login ,getUser};

