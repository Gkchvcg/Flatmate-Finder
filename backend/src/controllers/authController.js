import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

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

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone || undefined,
      verificationToken,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      
      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
      // In production, this URL should probably point to the frontend verify page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const verifyLink = `${frontendUrl}/verify-email/${verificationToken}`;

      console.log('----------------------------------------------------');
      console.log('VERIFICATION LINK:', verifyLink);
      console.log('----------------------------------------------------');

      const message = `Welcome to Flatmate Finder, ${user.name}!\n\nPlease verify your email by clicking the link below:\n\n${verifyLink}\n\nIf you did not request this, please ignore this email.`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6366f1;">Welcome to Flatmate Finder!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining our community. To ensure a safe environment for everyone, we require all users to verify their email addresses.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify My Email</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${verifyLink}</p>
          <p>See you on the platform!</p>
          <p>Best regards,<br>The Flatmate Finder Team</p>
        </div>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Verify your email - Flatmate Finder',
        message,
        html,
      });

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        message: 'Registration successful! Please check your email to verify your account.'
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
        if (!user.isVerified) {
          res.status(401);
          throw new Error('Please verify your email to login');
        }

        return res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
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

// @desc    Verify email token
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Check if user exists by token
    let user = await User.findOne({ verificationToken: token });

    if (!user) {
      // If no user found by token, check if it was already verified recently 
      // (This happens if user clicks the link twice)
      return res.status(400).json({ 
        message: 'Invalid or expired verification token. If you just clicked this, you might already be verified! Try logging in.',
        success: false 
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully! You can now login.',
      success: true
    });
  } catch (error) {
    next(error);
  }
};
