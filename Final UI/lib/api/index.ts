const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  // Custom options can be added here if needed
}

async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Add these console logs for debugging:
  console.log('[API Service] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('[API Service] Attempting to fetch full URL:', url);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP error! status: ${response.status} ${response.statusText}` };
      }
      const error: any = new Error(errorData?.message || `HTTP error! status: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) { // No Content
      return undefined as T;
    }

    return response.json() as Promise<T>;

  } catch (error) {
    console.error('API Service Request Error:', error);
    throw error; // Re-throw to be caught by calling function
  }
}

// Specific API functions will be added below this

export const registerUser = async (userData: any) => { // TODO: Define UserData type
  return request<any>('/auth/register', { // TODO: Define RegisterResponse type
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials: any) => { // TODO: Define Credentials type
  return request<any>('/auth/login', { // TODO: Define LoginResponse type (e.g., { token: string; user: User })
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async (token: string) => {
  return request<any>('/users/me', { // TODO: Define UserProfile type
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * @typedef {object} UserProfileData
 * @property {string} [full_name] - User's full name (for individuals).
 * @property {string} [company_name] - Company's name (for companies).
 * @property {string} [industry] - Company's industry (for companies).
 * @property {string} [company_size] - Company's size (for companies).
 * @property {string} [location] - User or company location.
 * @property {string} [professional_title] - User's professional title (for individuals).
 * @property {string} [years_of_experience] - User's years of experience (for individuals).
 * @property {string} [job_function] - User's job function (for individuals).
 * @property {string} [key_skills] - User's key skills, comma-separated (for individuals).
 * @property {string} [education_level] - User's education level (for individuals).
 * @property {string} [field_of_study] - User's field of study (for individuals).
 * @property {string} [institution] - User's educational institution (for individuals).
 * @property {string} [linkedin_url] - LinkedIn profile URL.
 * @property {string} [website_url] - Personal or company website URL.
 * @property {string} [bio] - User's summary or company's description.
 * @property {string} [company_type] - Type of company (for companies).
 * @property {string} [tech_stack] - Company's tech stack, comma-separated (for companies).
 */

/**
 * Updates the authenticated user's profile.
 * This can include fields for the 'users' table and 'user_profiles' table.
 * @param {UserProfileData} profileData - The data to update.
 * @param {string} token - The JWT token for authentication.
 * @returns {Promise<any>} The response from the server (e.g., a success message).
 *                        // TODO: Define a specific UpdateProfileResponse type
 */
export const updateUserProfile = async (profileData: any, token: string) => { // TODO: Replace 'any' with UserProfileData type
  return request<any>('/users/profile', { // TODO: Define UpdateProfileResponse type
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
};

export const updateUserPreferences = async (preferencesData: any, token: string) => { // TODO: Define PreferencesData type
  return request<any>('/users/preferences', { // TODO: Define UpdatePreferencesResponse type
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(preferencesData),
  });
};

export const updateUserCulture = async (cultureData: any, token: string) => { // TODO: Define CultureData type (ideally CultureFormValues from the page)
  return request<any>('/users/culture', { // TODO: Define UpdateCultureResponse type
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(cultureData),
  });
};
