// Route configuration
// TODO: should we use this for generating sidebar nav too?

var routes = [
  {
    path: '/dashboard',
    exact: true,
    label: 'Dashboard',
    icon: '&#128200;',
    component: 'Dashboard',
    requiresAuth: true,
  },
  {
    path: '/products',
    label: 'Products',
    icon: '&#128230;',
    component: 'Products',
    requiresAuth: true,
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: '&#128195;',
    component: 'Orders',
    requiresAuth: true,
  },
  {
    path: '/users',
    label: 'Users',
    icon: '&#128101;',
    component: 'Users',
    requiresAuth: true,
    requiredRole: 'admin',
  },
  {
    path: '/users/:id',
    label: 'User Detail',
    component: 'UserDetail',
    requiresAuth: true,
    hidden: true,  // don't show in sidebar
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: '&#128230;',
    component: 'Inventory',
    requiresAuth: true,
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: '&#128202;',
    component: 'Analytics',
    requiresAuth: true,
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: '&#128196;',
    component: 'Reports',
    requiresAuth: true,
  },
  {
    path: '/coupons',
    label: 'Coupons',
    icon: '&#127915;',
    component: 'Coupons',
    requiresAuth: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: '&#9881;',
    component: 'Settings',
    requiresAuth: true,
  },
  {
    path: '/login',
    label: 'Login',
    component: 'Login',
    requiresAuth: false,
    hidden: true,
  },
];

export default routes;
