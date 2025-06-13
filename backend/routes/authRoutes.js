const express = require('express');
const bcrypt = require('bcryptjs');    // Requires npm install
const jwt = require('jsonwebtoken'); // Requires npm install
const db = require('../db');         // Assumes db/index.js and pg (requires npm install)
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const {
    email,
    password,
    user_type, // 'individual' or 'company'
    full_name, // For individual
    company_name, // For company
    industry, // For company
    company_size // For company
  } = req.body;

  // Basic Input Validation
  if (!email || !password || !user_type) {
    return res.status(400).json({ message: 'Email, password, and user type are required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }
  if (!['individual', 'company'].includes(user_type)) {
    return res.status(400).json({ message: 'Invalid user type. Must be "individual" or "company".' });
  }
  if (user_type === 'individual' && !full_name) {
    return res.status(400).json({ message: 'Full name is required for individual users.' });
  }
  if (user_type === 'company' && !company_name) {
    return res.status(400).json({ message: 'Company name is required for company users.' });
  }

  try {
    // Check if user already exists
    const existingUserCheck = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existingUserCheck.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user into database
    let insertQuery;
    let queryParams;
    if (user_type === 'individual') {
      insertQuery = `
        INSERT INTO users (email, password_hash, user_type, full_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, user_type, full_name, created_at;
      `;
      queryParams = [email, password_hash, user_type, full_name];
    } else { // company
      insertQuery = `
        INSERT INTO users (email, password_hash, user_type, company_name, industry, company_size)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, user_type, company_name, created_at;
      `;
      queryParams = [email, password_hash, user_type, company_name, industry, company_size];
    }

    const newUserResult = await db.query(insertQuery, queryParams);
    const newUser = newUserResult.rows[0];

    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser
    });

  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === '23505') {
         return res.status(409).json({ message: 'User with this email already exists (constraint error).' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Retrieve user by email
    const userResult = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    // User matched, create JWT
    const payload = {
      userId: user.id,
      userType: user.user_type,
      email: user.email
      // Add other relevant non-sensitive info if needed
    };

    // Sign token
    // Ensure JWT_SECRET and JWT_EXPIRES_IN are in your .env file
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Default to 1 hour if not set
    );

    res.json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        full_name: user.full_name,
        company_name: user.company_name
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
