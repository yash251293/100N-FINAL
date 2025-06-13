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

// PUT /api/users/profile - Update current user's profile
// Protected route: Requires authentication
router.put('/profile', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  const {
    // Fields for 'users' table
    full_name, // individual
    company_name, // company
    industry, // company
    company_size, // company
    // Fields for 'user_profiles' table
    location,
    professional_title, // individual
    years_of_experience, // individual
    job_function, // individual
    key_skills, // individual
    education_level, // individual
    field_of_study, // individual
    institution, // individual
    linkedin_url,
    website_url,
    bio,
    company_type, // company
    tech_stack // company
  } = req.body;

  const client = await db.pool.connect(); // Assuming db exports a pool object

  try {
    await client.query('BEGIN');

    // 1. Update 'users' table
    const usersTableFields = {};
    if (full_name !== undefined) usersTableFields.full_name = full_name;
    if (company_name !== undefined) usersTableFields.company_name = company_name;
    if (industry !== undefined) usersTableFields.industry = industry;
    if (company_size !== undefined) usersTableFields.company_size = company_size;
    // Add user_type check here if needed, e.g. only set full_name if user_type is 'individual'

    const usersSetClauses = Object.keys(usersTableFields)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(', ');
    const usersValues = Object.values(usersTableFields);

    if (usersSetClauses.length > 0) {
      const updateUsersQuery = `UPDATE users SET ${usersSetClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
      await client.query(updateUsersQuery, [userId, ...usersValues]);
    }

    // 2. Upsert into 'user_profiles' table
    const profileFields = {
      location, professional_title, years_of_experience, job_function,
      key_skills, education_level, field_of_study, institution,
      linkedin_url, website_url, bio, company_type, tech_stack
    };

    const definedProfileFields = {};
    for (const key in profileFields) {
      if (profileFields[key] !== undefined) {
        definedProfileFields[key] = profileFields[key];
      }
    }

    if (Object.keys(definedProfileFields).length > 0) {
      const profileColumns = Object.keys(definedProfileFields);
      const profileValuesPlaceholders = profileColumns.map((_, index) => `$${index + 2}`).join(', ');
      const profileConflictUpdates = profileColumns.map(col => `"${col}" = EXCLUDED."${col}"`).join(', ');

      const upsertProfileQuery = `
        INSERT INTO user_profiles (user_id, ${profileColumns.map(col => `"${col}"`).join(', ')})
        VALUES ($1, ${profileValuesPlaceholders})
        ON CONFLICT (user_id) DO UPDATE SET
          ${profileConflictUpdates}, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `; // Added RETURNING * to get the upserted data

      await client.query(upsertProfileQuery, [userId, ...Object.values(definedProfileFields)]);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Profile updated successfully.' }); // Could return updated profile data later

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating profile:', error);
    // Basic error check, can be enhanced with specific validation errors
    if (error.code === '23503') { // foreign key violation
        return res.status(400).json({ message: 'Invalid user reference for profile update.' });
    }
    if (error.code === '23505') { // unique constraint violation (should not happen with ON CONFLICT for user_id)
        return res.status(400).json({ message: 'Profile conflict, potentially duplicate data issue.' });
    }
    res.status(500).json({ message: 'Server error while updating profile.' });
  } finally {
    client.release();
  }
});

module.exports = router;
