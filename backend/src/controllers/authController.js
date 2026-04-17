import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'flatmate-finder-dev-secret';

// Generate JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  console.log('Register request received:', req.body);
  try {
    const { name, email, password, phone } = req.body;
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPhone = phone?.trim();

    if (!normalizedName || !normalizedEmail || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone || undefined,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.error('User creation failed: Unknown error');
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400);
      return next(new Error('User already exists'));
    }
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Check for user email
    const user = await User.findOne({ email: normalizedEmail });
    console.log(`Login attempt for email: ${normalizedEmail}. User found: ${!!user}`);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match result for ${normalizedEmail}: ${isMatch}`);
      
      if (isMatch) {
        return res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    }

    console.warn(`Login failed for email: ${normalizedEmail} - Invalid credentials`);
    res.status(400);
    throw new Error('Invalid credentials');
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};
