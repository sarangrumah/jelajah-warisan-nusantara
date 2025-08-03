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
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || data.message || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
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

  async getCurrentUserRoles(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/api/auth/roles');
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

  // File upload
  async uploadFile(file: File, bucket: string): Promise<ApiResponse<{ url: string; path: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    try {
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': this.token ? `Bearer ${this.token}` : '',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Upload failed' };
    }
  }
}

export const apiClient = new ApiClient();