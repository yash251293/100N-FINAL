const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Assumes authMiddleware.js is in ../middleware
const db = require('../db'); // Assumes db/index.js exports a query function or pool

// GET /api/users/me - Get current user's profile
// Protected route: Requires authentication
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user should be populated by authMiddleware and contain the user ID from the token
    // The JWT payload created during login was: { userId: user.id, userType: user.user_type, email: user.email }
    // So, we should use req.user.userId or req.user.id depending on how it was set in the token.
    // Let's assume the payload was { userId: user.id, ... }, so req.user.userId exists.
    // If not, adjust to req.user.id if that's what your JWT payload for user ID is named.

    const userId = req.user.userId; // Or req.user.id if that's the key in your JWT payload

    if (!userId) {
      // This case should ideally not be reached if authMiddleware is working correctly and token is valid
      return res.status(400).json({ message: 'User ID not found in token.' });
    }

    const userQuery = `
      SELECT id, email, user_type, full_name, company_name, industry, company_size, created_at, updated_at
      FROM users
      WHERE id = $1;
    `;

    const { rows } = await db.query(userQuery, [userId]);

    if (rows.length === 0) {
      // This is an unlikely edge case: token is valid, but user ID doesn't exist in DB.
      // Could happen if user was deleted after token issuance but before expiry.
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile.' });
  }
});

module.exports = router;
