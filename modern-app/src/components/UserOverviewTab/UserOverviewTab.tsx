import UserStatusBadge from '../UserStatusBadge/UserStatusBadge';
import { formatDate, getRelativeTime } from '../../utils/dateUtils';
import type { User } from '../../hooks/useUserDetail';
import './UserOverviewTab.css';

export type UserOverviewTabProps = {
  user: User;
};

type StatItem = { label: string; value: string };

// TODO: wire to API — GET /api/users/:id/stats
const USER_STATS: StatItem[] = [
  { label: 'Orders Processed', value: '24' },
  { label: 'Products Updated', value: '156' },
  { label: 'Reports Generated', value: '12' },
  { label: 'Actions This Month', value: '89' },
];

export function UserOverviewTab({ user }: UserOverviewTabProps) {
  return (
    <div className="user-overview">
      <div className="user-info-grid">
        <div className="info-card">
          <h4 className="info-card-title">Contact Information</h4>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone</span>
            <span className="info-value">{user.phone || 'Not provided'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className="info-value">
              <UserStatusBadge status={user.role} />
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value">
              <UserStatusBadge status={user.status} />
            </span>
          </div>
        </div>

        <div className="info-card">
          <h4 className="info-card-title">Account Details</h4>
          <div className="info-row">
            <span className="info-label">User ID</span>
            <span className="info-value info-value--mono">#{user.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Joined</span>
            <span className="info-value">{formatDate(user.joinDate)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Login</span>
            <span className="info-value">
              {user.lastLogin ? (
                <span>
                  {formatDate(user.lastLogin)}
                  <br />
                  <span className="info-value__sub">
                    {getRelativeTime(user.lastLogin)}
                  </span>
                </span>
              ) : (
                'Never logged in'
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="info-card info-card--stats">
        <h4 className="info-card-title">Statistics</h4>
        <div className="user-stats-grid">
          {USER_STATS.map((stat) => (
            <div key={stat.label} className="user-stat">
              <span className="user-stat-number">{stat.value}</span>
              <span className="user-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserOverviewTab;
