import { getSession } from "next-auth/react";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

// Authenticated API client class
class AuthenticatedApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get session token for authentication
  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await getSession();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add session token if available
    if (session) {
      // Try to get the session token from the session object
      // NextAuth stores the session token in cookies, which will be sent automatically
      // For API requests, we can also pass it explicitly if needed
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}/api/v1${endpoint}`;
      const headers = await this.getAuthHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'include', // Important: Include cookies for NextAuth session
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data: any = {};
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('API Response data:', data);
        } catch (jsonError) {
          console.warn('Failed to parse JSON response:', jsonError);
          data = { message: 'Failed to parse server response' };
        }
      } else {
        // For non-JSON responses (like HTML error pages), get text
        const textResponse = await response.text();
        console.warn('Non-JSON response received:', textResponse.substring(0, 200));
        data = { 
          message: response.ok ? 'Success' : `Server error: ${response.status} ${response.statusText}`,
          responseText: textResponse.substring(0, 500) // Limit response text
        };
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // User profile methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/profile/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/profile/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  // Website methods
  async getWebsites(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/website');
  }

  async createWebsite(websiteData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/website', {
      method: 'POST',
      body: JSON.stringify(websiteData),
    });
  }

  async getWebsiteById(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/website/${id}/logs`);
  }

  // Website status (basic website record)
  async getWebsiteStatus(websiteId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/website/status/${websiteId}`)
  }

  // Get website ticks
  async getWebsiteTicks(websiteId: string, limit = 50, hours = 24): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/website/${websiteId}/ticks?limit=${limit}&hours=${hours}`);
  }

  // Generic GET method
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  // Generic POST method
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Generic PATCH method
  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Generic DELETE method
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new AuthenticatedApiClient();

// Export utility functions
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.getCurrentUser();
    console.log(response);
    return response.user || null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

// Hook for React components
export function useApiClient() {
  return apiClient;
}