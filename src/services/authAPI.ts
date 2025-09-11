// Authentication API Service
// Real backend calls for user authentication

import { API_BASE_URL, getAuthHeaders } from './gameAPI';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  uid: string;
  username: string;
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  uid: string;
  username: string;
  token: string;
}

export interface AuthError {
  message: string;
}

export class AuthAPIError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AuthAPIError';
  }
}

// Authentication API calls
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('🔍 Login Response Status:', response.status);
      console.log('🔍 Login Response Data:', data);
      console.log('🔍 Data properties:', {
        uid: data.uid,
        username: data.username, 
        token: data.token,
        message: data.message
      });

      if (!response.ok) {
        console.error('❌ Login failed with status:', response.status);
        throw new AuthAPIError(data.message || 'Login failed', response.status);
      }

      // Validate that we got the required data
      if (!data.uid || !data.username || !data.token) {
        console.error('❌ Login response missing required fields:', data);
        throw new AuthAPIError('Login response incomplete - missing uid, username, or token', 500);
      }

      // Store auth token and UID in sessionStorage
      console.log('💾 Storing login data in sessionStorage');
      console.log('📊 Raw data received:', data);
      
      if (data.token) sessionStorage.setItem('authToken', data.token);
      if (data.uid) sessionStorage.setItem('currentUID', data.uid);
      if (data.username) sessionStorage.setItem('username', data.username);
      
      // Verify storage worked
      console.log('✅ Stored values:', {
        authToken: sessionStorage.getItem('authToken'),
        currentUID: sessionStorage.getItem('currentUID'),
        username: sessionStorage.getItem('username')
      });

      return data;
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error;
      }
      
      // Handle network errors
      throw new AuthAPIError(
        error instanceof Error ? error.message : 'Network error during login',
        0
      );
    }
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthAPIError(data.message || 'Registration failed', response.status);
      }

      // Store auth token and UID in sessionStorage after successful registration
      console.log('💾 Storing registration data in sessionStorage');
      console.log('📊 Raw registration data received:', data);
      
      if (data.token) sessionStorage.setItem('authToken', data.token);
      if (data.uid) sessionStorage.setItem('currentUID', data.uid);
      if (data.username) sessionStorage.setItem('username', data.username);
      
      console.log('✅ Stored registration values:', {
        authToken: sessionStorage.getItem('authToken'),
        currentUID: sessionStorage.getItem('currentUID'),
        username: sessionStorage.getItem('username')
      });

      return data;
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error;
      }
      
      throw new AuthAPIError(
        error instanceof Error ? error.message : 'Network error during registration',
        0
      );
    }
  },

  async logout(): Promise<void> {
    // Clear stored authentication data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUID');
    sessionStorage.removeItem('username');
  },

  getCurrentUID(): string | null {
    return sessionStorage.getItem('currentUID');
  },

  getCurrentUser(): { uid: string; username: string } | null {
    const uid = sessionStorage.getItem('currentUID');
    const username = sessionStorage.getItem('username');
    if (uid && username) {
      return { uid, username };
    }
    return null;
  },

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUID() && !!this.getAuthToken();
  },

  async hasCharacter(): Promise<boolean> {
    const uid = this.getCurrentUID();
    if (!uid) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/character/${uid}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.status === 404) {
        return false;
      }

      if (!response.ok) {
        throw new AuthAPIError('Failed to check character existence', response.status);
      }

      const result = await response.json();
      
      // Handle the new response format from backend
      if (typeof result === 'object' && 'hasCharacter' in result) {
        return result.hasCharacter;
      }
      
      // Legacy fallback - if we get a character object directly, they have a character
      return true;
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error;
      }
      
      console.warn('Error checking character existence:', error);
      return false;
    }
  },

  async deleteAccount(): Promise<void> {
    const uid = this.getCurrentUID();
    if (!uid) {
      throw new AuthAPIError('No user logged in', 401);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ uid }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthAPIError(data.message || 'Account deletion failed', response.status);
      }

      // Clear auth data after successful deletion
      await this.logout();
    } catch (error) {
      if (error instanceof AuthAPIError) {
        throw error;
      }
      
      throw new AuthAPIError(
        error instanceof Error ? error.message : 'Network error during account deletion',
        0
      );
    }
  }
};

export default authAPI;