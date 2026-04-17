import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type RouteConfig = {
  path: string;
  label: string;
  icon?: string;
  requiresAuth?: boolean;
  requiredRole?: 'admin' | 'user';
  hidden?: boolean;
  component: LazyExoticComponent<ComponentType>;
};

export const routes: RouteConfig[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '\u{1F4C8}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Dashboard')),
  },
  {
    path: '/products',
    label: 'Products',
    icon: '\u{1F4E6}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Products')),
  },
  {
    path: '/orders',
    label: 'Orders',
    icon: '\u{1F4C3}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Orders')),
  },
  {
    path: '/users',
    label: 'Users',
    icon: '\u{1F465}',
    requiresAuth: true,
    requiredRole: 'admin',
    component: lazy(() => import('../pages/Users')),
  },
  {
    path: '/users/:id',
    label: 'User Detail',
    requiresAuth: true,
    hidden: true,
    component: lazy(() => import('../pages/UserDetail/UserDetail')),
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: '\u{1F4E6}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Inventory/Inventory')),
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: '\u{1F4CA}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Analytics/Analytics')),
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: '\u{1F4C4}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Reports/Reports')),
  },
  {
    path: '/coupons',
    label: 'Coupons',
    icon: '\u{1F3AB}',
    requiresAuth: true,
    component: lazy(() => import('../pages/Coupons')),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: '\u2699\uFE0F',
    requiresAuth: true,
    component: lazy(() => import('../pages/Settings')),
  },
  {
    path: '/login',
    label: 'Login',
    hidden: true,
    component: lazy(() => import('../pages/Login')),
  },
];

export default routes;
