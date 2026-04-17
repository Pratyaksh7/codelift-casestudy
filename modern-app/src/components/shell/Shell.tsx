import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ShellHeader } from './ShellHeader';
import { ShellSidebar } from './ShellSidebar';
import type { NavItem, ShellUser } from './types';
import './Shell.css';

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/users', label: 'Users' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/reports', label: 'Reports' },
  { to: '/coupons', label: 'Coupons' },
  { to: '/settings', label: 'Settings' },
];

export type ShellProps = {
  user?: ShellUser;
};

function Shell({ user = { name: 'Admin' } }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="app-shell">
      <ShellHeader user={user} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="app-shell__main">
        <ShellSidebar isOpen={sidebarOpen} items={NAV_ITEMS} />
        <div
          className={`app-shell__content${sidebarOpen ? '' : ' app-shell__content--full'}`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Shell;
