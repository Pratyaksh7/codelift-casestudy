import { Link } from 'react-router-dom';
import UserStatusBadge from '../UserStatusBadge/UserStatusBadge';
import type { User } from '../../hooks/useUserDetail';
import './UserDetailHeader.css';

export type UserDetailHeaderProps = {
  user: User;
  onEdit: () => void;
  backHref: string;
};

export function UserDetailHeader({
  user,
  onEdit,
  backHref,
}: UserDetailHeaderProps) {
  return (
    <div className="user-detail-header">
      <div className="user-detail-avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="user-detail-info">
        <h2>{user.name}</h2>
        <p className="user-detail-info__email">{user.email}</p>
        <div className="user-detail-info__badges">
          <UserStatusBadge status={user.role} />
          <UserStatusBadge status={user.status} />
        </div>
      </div>
      <div className="user-detail-actions">
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          Edit User
        </button>
        <Link to={backHref} className="btn btn-secondary">
          Back to Users
        </Link>
      </div>
    </div>
  );
}

export default UserDetailHeader;
