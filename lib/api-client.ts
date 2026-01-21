// API client for making requests to backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new ApiError(
      error.error || error.message || "Request failed",
      response.status,
      error
    )
  }

  return response.json()
}

// Products API
export const productsApi = {
  getAll: (params?: {
    category?: string
    categoryId?: string
    featured?: boolean
    newArrival?: boolean
    festival?: boolean
    search?: string
    inStock?: boolean
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append("category", params.category)
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId)
    if (params?.featured) searchParams.append("featured", "true")
    if (params?.newArrival) searchParams.append("newArrival", "true")
    if (params?.festival) searchParams.append("festival", "true")
    if (params?.search) searchParams.append("search", params.search)
    if (params?.inStock) searchParams.append("inStock", "true")
    
    const query = searchParams.toString()
    return fetchApi<any[]>(`/products${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchApi<any>(`/products/${id}`),

  create: (product: any) =>
    fetchApi<any>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  update: (id: string, product: Partial<any>) =>
    fetchApi<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Categories API
export const categoriesApi = {
  getAll: () => fetchApi<any[]>("/categories"),

  getById: (id: string) => fetchApi<any>(`/categories/${id}`),

  create: (category: any) =>
    fetchApi<any>("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),

  update: (id: string, category: Partial<any>) =>
    fetchApi<any>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/categories/${id}`, {
      method: "DELETE",
    }),
}

// Cart API
export const cartApi = {
  get: () => fetchApi<{ items: any[] }>("/cart"),

  add: (productId: string, quantity?: number, selectedSize?: any) =>
    fetchApi<{ success: boolean; message: string }>("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity, selectedSize }),
    }),

  update: (itemId: string, quantity: number) =>
    fetchApi<{ success: boolean; message: string }>("/cart", {
      method: "PUT",
      body: JSON.stringify({ itemId, quantity }),
    }),

  remove: (itemId: string) =>
    fetchApi<{ success: boolean; message: string }>(`/cart?itemId=${itemId}`, {
      method: "DELETE",
    }),

  clear: () =>
    fetchApi<{ success: boolean; message: string }>("/cart?clearAll=true", {
      method: "DELETE",
    }),
}

// Orders API
export const ordersApi = {
  getAll: (params?: { status?: string; phone?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append("status", params.status)
    if (params?.phone) searchParams.append("phone", params.phone)
    
    const query = searchParams.toString()
    return fetchApi<any[]>(`/orders${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchApi<any>(`/orders/${id}`),

  create: (order: any) =>
    fetchApi<any>("/orders", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (id: string, order: Partial<any>) =>
    fetchApi<any>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(order),
    }),
}

// Messages API
export const messagesApi = {
  getAll: (params?: { isRead?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.isRead !== undefined) searchParams.append("isRead", String(params.isRead))
    
    const query = searchParams.toString()
    return fetchApi<any[]>(`/messages${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchApi<any>(`/messages/${id}`),

  create: (message: any) =>
    fetchApi<any>("/messages", {
      method: "POST",
      body: JSON.stringify(message),
    }),

  update: (id: string, message: Partial<any>) =>
    fetchApi<any>(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(message),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/messages/${id}`, {
      method: "DELETE",
    }),
}

// Banners API
export const bannersApi = {
  getAll: () => fetchApi<any[]>("/banners"),

  getById: (id: string) => fetchApi<any>(`/banners/${id}`),

  create: (banner: any) =>
    fetchApi<any>("/banners", {
      method: "POST",
      body: JSON.stringify(banner),
    }),

  update: (id: string, banner: Partial<any>) =>
    fetchApi<any>(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(banner),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/banners/${id}`, {
      method: "DELETE",
    }),
}

// Social Media API
export const socialMediaApi = {
  getAll: () => fetchApi<any[]>("/social-media"),

  getById: (id: string) => fetchApi<any>(`/social-media/${id}`),

  create: (post: any) =>
    fetchApi<any>("/social-media", {
      method: "POST",
      body: JSON.stringify(post),
    }),

  update: (id: string, post: Partial<any>) =>
    fetchApi<any>(`/social-media/${id}`, {
      method: "PUT",
      body: JSON.stringify(post),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/social-media/${id}`, {
      method: "DELETE",
    }),
}

