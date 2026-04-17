import { NavLink } from 'react-router-dom';
import type { NavItem } from './types';

export type ShellSidebarProps = {
  isOpen: boolean;
  items: NavItem[];
  version?: string;
};

export function ShellSidebar({ isOpen, items, version = 'v1.2.0' }: ShellSidebarProps) {
  if (!isOpen) return null;
  return (
    <nav className="app-shell__sidebar">
      <ul className="app-shell__sidebar-nav">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `app-shell__nav-link${isActive ? ' app-shell__nav-link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="app-shell__sidebar-footer">
        <p>{version}</p>
      </div>
    </nav>
  );
}

export default ShellSidebar;
