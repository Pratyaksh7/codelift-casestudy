export const endpoints = {
  dashboard: {
    stats: '/api/dashboard/stats',
  },
  products: {
    list: '/api/products',
    byId: (id: number | string) => `/api/products/${id}`,
  },
  orders: {
    list: '/api/orders',
    byId: (id: string) => `/api/orders/${id}`,
  },
  users: {
    list: '/api/users',
    byId: (id: string) => `/api/users/${id}`,
    activityById: (id: string) => `/api/users/${id}/activity`,
  },
  inventory: {
    list: '/api/inventory',
    byId: (id: number | string) => `/api/inventory/${id}`,
    bulkUpdate: '/api/inventory/bulk-update',
    restock: (id: number | string) => `/api/inventory/${id}/restock`,
  },
  analytics: {
    data: '/api/analytics',
    salesReport: '/api/analytics/sales-report',
  },
  coupons: {
    list: '/api/coupons',
    byId: (id: number | string) => `/api/coupons/${id}`,
  },
  settings: {
    root: '/api/settings',
    profile: '/api/settings/profile',
    notifications: '/api/settings/notifications',
    security: '/api/settings/security',
  },
  auth: {
    login: '/api/auth/login',
  },
} as const;
