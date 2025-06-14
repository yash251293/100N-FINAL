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
      SELECT
        u.id, u.email, u.user_type, u.full_name, u.company_name, u.industry, u.company_size,
        u.created_at AS user_created_at, u.updated_at AS user_updated_at,
        up.location, up.professional_title, up.years_of_experience, up.job_function,
        up.key_skills, up.education_level, up.field_of_study, up.institution,
        up.linkedin_url, up.website_url, up.bio, up.company_type, up.tech_stack,
        up.created_at AS profile_created_at, up.updated_at AS profile_updated_at
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1;
    `;

    const { rows } = await db.query(userQuery, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userData = rows[0];
    const userResponse = {
      id: userData.id,
      email: userData.email,
      user_type: userData.user_type,
      full_name: userData.full_name,
      company_name: userData.company_name,
      industry: userData.industry,
      company_size: userData.company_size,
      user_created_at: userData.user_created_at,
      user_updated_at: userData.user_updated_at,
      profile: {
        location: userData.location,
        professional_title: userData.professional_title,
        years_of_experience: userData.years_of_experience,
        job_function: userData.job_function,
        key_skills: userData.key_skills,
        education_level: userData.education_level,
        field_of_study: userData.field_of_study,
        institution: userData.institution,
        linkedin_url: userData.linkedin_url,
        website_url: userData.website_url,
        bio: userData.bio,
        company_type: userData.company_type,
        tech_stack: userData.tech_stack,
        profile_created_at: userData.profile_created_at,
        profile_updated_at: userData.profile_updated_at
      }
    };

    // If no profile exists, the profile object will have all null values.
    // Check if a key profile field (like professional_title for individual or company_type for company, or just bio) is null.
    // This indicates no actual profile record was joined.
    if (userResponse.profile.bio === null &&
        userResponse.profile.location === null &&
        userResponse.profile.professional_title === null && // Add a few more key fields
        userResponse.profile.company_type === null) {
      userResponse.profile = null; // Or an empty object {} if preferred by frontend
    }

    res.json(userResponse);

  } catch (error) {
    console.error('Error fetching user profile with details:', error);
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
