import { setGlobalLoading } from "@/components/LoadingContext";

// API Client for backend integration
export interface ApiResponse<T = any> {
 data?: T;
 error?: string;
 message?: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  display_name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.token = localStorage.getItem('auth_token');
    console.log('🌐 API Client initialized with baseUrl:', this.baseUrl);
    console.log('🔑 Auth token present:', !!this.token);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add Accept-Language header for automatic translation
    // Get current language from i18n or localStorage
    const currentLang = localStorage.getItem('i18nextLng') || 'id';
    headers['Accept-Language'] = currentLang;

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    setGlobalLoading(true);
    try {
      console.log('FETCH URL:', `${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });
  
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        return { error: 'Server error occurred' };
      }
  
      if (!response.ok) {
        return { error: data.error || data.message || 'An error occurred' };
      }
  
      return { data };
    } catch (error) {
      console.error('Network error:', error);
      return { error: 'Network error occurred' };
    } finally {
      setGlobalLoading(false);
    }
  }

  // Auth methods
  async signIn(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async signUp(email: string, password: string, displayName?: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getProfile(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/auth/profile/${userId}`);
  }

  async getAllProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/auth/profile`);
  }

  async getCurrentUserRoles(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/api/auth/roles');
  }

  async changePassword(data: { new_password: string; confirm_password: string }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Password reset methods
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword
      }),
    });
  }

  async validateResetToken(token: string): Promise<ApiResponse<{ valid: boolean }>> {
    return this.request<{ valid: boolean }>(`/api/auth/validate-reset-token/${token}`);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic CRUD methods
  async getAll<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T[]>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T[]>(`/api/${endpoint}${queryString}`);
  }

  async getById<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    return this.request<T>(`/api/${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(`/api/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update<T>(endpoint: string, id: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(`/api/${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/${endpoint}/${id}`, {
      method: 'DELETE',
    });
  }

  async approve<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    return this.request<T>(`/api/${endpoint}/${id}/approve`, {
      method: 'POST',
    });
  }

  async reject<T>(endpoint: string, id: string, reason: string): Promise<ApiResponse<T>> {
    return this.request<T>(`/api/${endpoint}/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason_rejected: reason }),
    });
  }

  // File upload
  async uploadFile(file: File, bucket: string): Promise<ApiResponse<{ url: string; name: string; originalName: string; size: number; type: string }>> {
    const formData = new FormData();
    // Append bucket first so multer's fileFilter can read it before handling the file
    formData.append('bucket', bucket);
    formData.append('file', file);

    setGlobalLoading(true);
    try {
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
        body: formData,
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        return { error: responseData.error || 'Upload failed' };
      }
  
      return { data: responseData.file };
    } catch (error) {
      return { error: 'Upload failed'+error };
    } finally {
      setGlobalLoading(false);
    }
  }
}

export const apiClient = new ApiClient();
