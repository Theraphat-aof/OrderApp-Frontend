import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, User } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('Session refresh failed:', refreshError);
            this.clearTokens();
            if (typeof window !== 'undefined') {
               // Only redirect if we are sure refresh failed
               const isLoginPage = window.location.pathname === '/login';
               if (!isLoginPage) {
                   window.location.href = '/login';
               }
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.tokenRefreshPromise = (async () => {
      try {
        const response = await this.client.post('/auth/refresh', {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        this.setTokens(accessToken, newRefreshToken);
        return accessToken;
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    return this.tokenRefreshPromise;
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password,
      });
      let tokens: any;
      
      if (response.data.data) {
        // Wrapped response
        tokens = response.data.data;
      } else if (response.data.accessToken) {
        // Direct response
        tokens = response.data;
      } else {
        throw new Error('Invalid response format: missing tokens');
      }
      
      const { accessToken, refreshToken, user } = tokens;
      
      this.setTokens(accessToken, refreshToken);
      return {
        success: true,
        data: { user },
      };
    } catch (error) {
      console.error('Login error details:', error);
      return this.handleError(error);
    }
  }

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/auth/register', {
        fullName,
        email,
        password,
      });
      // Backend wraps response
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const response = await this.client.get('/auth/me');
      
      // Handle both wrapped and unwrapped responses
      // Unwrapped: { id: ..., email: ... }
      // Wrapped: { data: { user: ... } } or { data: { ... } }
      let userData = response.data;
      if (response.data.data) {
        userData = response.data.data.user || response.data.data;
      }

      return {
        success: true,
        data: userData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Order endpoints
  async getOrders(params?: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      // Convert string params to correct types
      const cleanParams: Record<string, any> = {
        ...params,
        limit: params?.limit ? Number(params.limit) : undefined,
      };
      
      Object.keys(cleanParams).forEach(
        (key) => cleanParams[key] === undefined && delete cleanParams[key]
      );

      const response = await this.client.get('/orders', { params: cleanParams });
      
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/orders', data);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getOrderById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/orders/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateOrder(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.patch(`/orders/${id}`, data);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteOrder(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.delete(`/orders/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Product endpoints
  async getProducts(params?: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      const cleanParams: Record<string, any> = {
        ...params,
        limit: params?.limit ? Number(params.limit) : 20,
        offset: params?.offset ? Number(params.offset) : 0,
      };

      Object.keys(cleanParams).forEach(
        (key) => cleanParams[key] === undefined && delete cleanParams[key]
      );

      const response = await this.client.get('/products', { params: cleanParams });
      return {
        success: true,
        data: response.data.data || response.data, // { data: [...], pagination: {...} }
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProductById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/products/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProductsByCategory(category: string, limit: number = 20): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/products/category/${category}`, {
        params: { limit },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createProduct(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post('/products', data);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateProduct(id: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.patch(`/products/${id}`, data);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.delete(`/products/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async uploadProductImage(file: File): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData();
      // Backend FileInterceptor expects 'image' field, not 'file'
      formData.append('image', file);

      // Use multipart/form-data for file upload
      const response = await this.client.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<any> {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    
    // Backend response format: { success: false, message: ..., error: ... }
    const responseData = axiosError.response?.data as any;
    const message = responseData?.message || axiosError.message || 'An error occurred';

    console.error('🔴 Error response:', { status, message, responseData });

    return {
      success: false,
      error: {
        status,
        message,
      },
    };
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
