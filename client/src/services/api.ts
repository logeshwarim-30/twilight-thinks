const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('twilight_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred during API request');
  }
  return data;
}

export const api = {
  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null) {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    return request<{ success: boolean; count: number; products: any[] }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (idOrSlug: string) => {
    return request<{ success: boolean; product: any }>(`/products/${idOrSlug}`);
  },

  // Categories
  getCategories: () => {
    return request<{ success: boolean; count: number; categories: any[] }>('/categories');
  },

  // Auth
  login: (credentials: { email: string; password: string }) => {
    return request<{ success: boolean; token: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: (userData: { name: string; email: string; password: string; phone?: string }) => {
    return request<{ success: boolean; token: string; user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getMe: () => {
    return request<{ success: boolean; user: any }>('/auth/me');
  },

  updateProfile: (data: any) => {
    return request<{ success: boolean; user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  toggleWishlist: (productId: string) => {
    return request<{ success: boolean; wishlist: string[]; message: string }>('/auth/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  },

  // Orders
  createOrder: (orderData: any) => {
    return request<{ success: boolean; order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getMyOrders: () => {
    return request<{ success: boolean; orders: any[] }>('/orders/my-orders');
  },

  getOrder: (id: string) => {
    return request<{ success: boolean; order: any }>(`/orders/${id}`);
  },

  // Image Upload
  uploadImage: async (file: File) => {
    const token = localStorage.getItem('twilight_token');
    const formData = new FormData();
    formData.append('image', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Image upload failed');
    }
    return data as { success: boolean; url: string; relativeUrl: string; filename: string };
  },

  // Custom Tattoos
  createCustomTattoo: (data: any) => {
    return request<{ success: boolean; customTattoo: any; message: string }>('/custom-tattoos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getMyCustomTattoos: () => {
    return request<{ success: boolean; count: number; customTattoos: any[] }>('/custom-tattoos/my-requests');
  },

  confirmCustomTattoo: (id: string) => {
    return request<{ success: boolean; customTattoo: any; message: string }>(`/custom-tattoos/${id}/confirm`, {
      method: 'POST'
    });
  },

  getCustomTattoo: (id: string) => {
    return request<{ success: boolean; customTattoo: any }>(`/custom-tattoos/${id}`);
  },

  // Studio Settings
  getSettings: () => {
    return request<{ success: boolean; settings: any }>('/settings');
  },

  // Reviews
  getReviews: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ success: boolean; count: number; reviews: any[] }>(`/reviews${query ? `?${query}` : ''}`);
  },

  createReview: (reviewData: any) => {
    return request<{ success: boolean; review: any; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  // Coupons
  validateCoupon: (code: string, cartTotal: number) => {
    return request<{ success: boolean; coupon: any; message: string }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal })
    });
  },

  // Homepage CMS
  getHomepageSections: () => {
    return request<{ success: boolean; sections: any[] }>('/homepage');
  },

  // ADMIN ENDPOINTS
  admin: {
    getAnalytics: () => {
      return request<{ success: boolean; analytics: any }>('/admin/analytics');
    },

    getCustomers: () => {
      return request<{ success: boolean; count: number; customers: any[] }>('/admin/customers');
    },

    getInventory: () => {
      return request<{ success: boolean; count: number; inventory: any[] }>('/admin/inventory');
    },

    updateInventoryStock: (id: string, stock: number) => {
      return request<{ success: boolean; item: any; message: string }>(`/admin/inventory/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock })
      });
    },

    // Products CRUD
    createProduct: (data: any) => {
      return request<{ success: boolean; product: any; message: string }>('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    updateProduct: (id: string, data: any) => {
      return request<{ success: boolean; product: any; message: string }>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    deleteProduct: (id: string) => {
      return request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE'
      });
    },

    // Categories CRUD
    createCategory: (data: any) => {
      return request<{ success: boolean; category: any; message: string }>('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    updateCategory: (id: string, data: any) => {
      return request<{ success: boolean; category: any; message: string }>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    deleteCategory: (id: string) => {
      return request<{ success: boolean; message: string }>(`/categories/${id}`, {
        method: 'DELETE'
      });
    },

    // Orders Management
    getOrders: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams(params).toString();
      return request<{ success: boolean; count: number; orders: any[] }>(`/orders${query ? `?${query}` : ''}`);
    },

    updateOrderStatus: (id: string, status: string, note?: string) => {
      return request<{ success: boolean; order: any; message: string }>(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note })
      });
    },

    // Custom Tattoos Management
    getCustomTattoos: (params: Record<string, any> = {}) => {
      const query = new URLSearchParams(params).toString();
      return request<{ success: boolean; count: number; customTattoos: any[] }>(`/custom-tattoos${query ? `?${query}` : ''}`);
    },

    updateCustomTattoo: (id: string, data: any) => {
      return request<{ success: boolean; customTattoo: any; message: string }>(`/custom-tattoos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    // Coupons CRUD
    getCoupons: () => {
      return request<{ success: boolean; count: number; coupons: any[] }>('/coupons');
    },

    createCoupon: (data: any) => {
      return request<{ success: boolean; coupon: any; message: string }>('/coupons', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    updateCoupon: (id: string, data: any) => {
      return request<{ success: boolean; coupon: any; message: string }>(`/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    deleteCoupon: (id: string) => {
      return request<{ success: boolean; message: string }>(`/coupons/${id}`, {
        method: 'DELETE'
      });
    },

    // Reviews Moderation
    updateReviewStatus: (id: string, status: string) => {
      return request<{ success: boolean; review: any; message: string }>(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    },

    deleteReview: (id: string) => {
      return request<{ success: boolean; message: string }>(`/reviews/${id}`, {
        method: 'DELETE'
      });
    },

    // Homepage CMS
    updateHomepageSection: (key: string, data: any) => {
      return request<{ success: boolean; section: any; message: string }>(`/homepage/${key}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    // Studio Settings
    updateSettings: (data: any) => {
      return request<{ success: boolean; settings: any; message: string }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  }
};
