import { useEffect, useRef, useState } from 'react';
import type { ShellUser } from './types';

export type ShellHeaderProps = {
  user: ShellUser;
  onToggleSidebar: () => void;
};

export function ShellHeader({ user, onToggleSidebar }: ShellHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = () => {
    // TODO: wire to API — legacy dispatches logout() from redux authActions
    console.log('logging out user...');
  };

  const initial = user ? user.name.charAt(0).toUpperCase() : 'A';
  const displayName = user ? user.name : 'Admin';

  return (
    <header className="app-shell__header">
      <div className="app-shell__header-left">
        <button
          className="app-shell__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          type="button"
        >
          &#9776;
        </button>
        <h1 className="app-shell__logo">EcomDash</h1>
      </div>
      <div className="app-shell__header-right">
        <div className="app-shell__user-menu" ref={menuRef}>
          <button
            className="app-shell__user-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            type="button"
          >
            <span className="app-shell__avatar">{initial}</span>
            <span className="app-shell__user-name">{displayName}</span>
          </button>
          {dropdownOpen && (
            <div className="app-shell__dropdown">
              <a href="profile" className="app-shell__dropdown-item">Profile</a>
              <a href="settings" className="app-shell__dropdown-item">Settings</a>
              <hr />
              <a href="logout" className="app-shell__dropdown-item" onClick={handleLogout}>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ShellHeader;
