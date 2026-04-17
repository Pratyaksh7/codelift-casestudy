import type { User } from './types';

const now = Date.now();
const hoursAgo = (h: number): string => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d: number): string => new Date(now - d * 86400 * 1000).toISOString();

// TODO: wire to API — GET /api/users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'admin',
    status: 'active',
    phone: '555-0101',
    lastLogin: hoursAgo(2),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    role: 'manager',
    status: 'active',
    phone: '555-0102',
    lastLogin: hoursAgo(8),
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    role: 'editor',
    status: 'inactive',
    phone: '555-0103',
    lastLogin: daysAgo(5),
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'viewer',
    status: 'pending',
    phone: '',
    lastLogin: null,
  },
  {
    id: '5',
    name: 'Eve Martinez',
    email: 'eve.martinez@example.com',
    role: 'editor',
    status: 'active',
    phone: '555-0105',
    lastLogin: daysAgo(1),
  },
  {
    id: '6',
    name: 'Frank Brown',
    email: 'frank.brown@example.com',
    role: 'viewer',
    status: 'active',
    phone: '555-0106',
    lastLogin: hoursAgo(30),
  },
];
