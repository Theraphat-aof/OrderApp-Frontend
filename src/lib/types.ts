// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Order Types
export interface Order {
  id: string;
  productName: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  createdAt: string;
  status?: 'pending' | 'completed' | 'cancelled';
  customerId?: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  message: string;
}

// Filter & Sort Types
export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
