const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  // Custom options can be added here if needed
}

async function request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

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
