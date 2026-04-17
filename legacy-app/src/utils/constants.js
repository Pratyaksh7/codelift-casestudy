// Application constants
// TODO: these should come from environment variables

// API Base URLs - hardcoded for now
export const API_BASE_URL = 'http://localhost:3001/api';
export const API_AUTH_URL = 'http://localhost:3001/api/auth';
export const API_PRODUCTS_URL = 'http://localhost:3001/api/products';
export const API_ORDERS_URL = 'http://localhost:3001/api/orders';
export const API_USERS_URL = 'http://localhost:3001/api/users';
export const API_ANALYTICS_URL = 'http://localhost:3001/api/analytics';
export const API_INVENTORY_URL = 'http://localhost:3001/api/inventory';
export const API_COUPONS_URL = 'http://localhost:3001/api/coupons';
export const API_REPORTS_URL = 'http://localhost:3001/api/reports';
export const API_SETTINGS_URL = 'http://localhost:3001/api/settings';
export const API_NOTIFICATIONS_URL = 'http://localhost:3001/api/notifications';
export const API_UPLOAD_URL = 'http://localhost:3001/api/upload';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  admin: 'Administrator',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
}

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const ORDER_STATUS_COLORS = {
  pending: '#95a5a6',
  processing: '#f39c12',
  shipped: '#3498db',
  completed: '#27ae60',
  cancelled: '#e74c3c',
  refunded: '#8e44ad',
};

// Product categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Health & Beauty',
  'Automotive',
  'Food & Grocery',
];

// Coupon types
export const COUPON_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  FREE_SHIPPING: 'free_shipping',
  BUY_ONE_GET_ONE: 'bogo',
}

export const COUPON_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired',
  SCHEDULED: 'scheduled',
}

// Inventory statuses
export const INVENTORY_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
}

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Date formats used with moment.js
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATE_TIME_FORMAT = 'MMM DD, YYYY h:mm A';
export const DATE_FORMAT_SHORT = 'MM/DD/YY';
export const DATE_FORMAT_INPUT = 'YYYY-MM-DD';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'ecomdash_theme',
  SIDEBAR_STATE: 'ecomdash_sidebar',
  LANGUAGE: 'ecomdash_lang',
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

// Chart colors palette
export const CHART_COLORS = [
  '#4a90d9',
  '#27ae60',
  '#e74c3c',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#2ecc71',
  '#3498db',
];

// max file upload size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
