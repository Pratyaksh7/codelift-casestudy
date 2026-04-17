import { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb, {
  type BreadcrumbItem,
} from '../../components/Breadcrumb/Breadcrumb';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import UserDetailHeader from '../../components/UserDetailHeader/UserDetailHeader';
import UserOverviewTab from '../../components/UserOverviewTab/UserOverviewTab';
import UserActivityTab from '../../components/UserActivityTab/UserActivityTab';
import { useUserDetail } from '../../hooks/useUserDetail';
import './UserDetail.css';

type TabKey = 'overview' | 'activity';

type TabDef = { key: TabKey; label: string };

const TABS: readonly TabDef[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'activity', label: 'Activity Log' },
];

const USERS_PATH = '/users';

export function UserDetail() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const { id } = useParams<{ id: string }>();
  const { user, activityLog, loading, error } = useUserDetail(id);

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(
    () => [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Users', path: USERS_PATH },
      { label: user?.name ?? '' },
    ],
    [user?.name],
  );

  const handleEditUser = useCallback(() => {
    // TODO: implement edit user
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading user details..." />;
  }

  if (!user) {
    return (
      <div className="user-detail-missing">
        <h3>User not found</h3>
        <Link to={USERS_PATH} className="user-detail-missing__link">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <Breadcrumb items={breadcrumbItems} />

      {error ? (
        <div className="user-detail-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <UserDetailHeader
        user={user}
        onEdit={handleEditUser}
        backHref={USERS_PATH}
      />

      <div className="user-detail-tabs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn${isActive ? ' tab-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="user-detail-content">
        {activeTab === 'overview' && <UserOverviewTab user={user} />}
        {activeTab === 'activity' && (
          <UserActivityTab activityLog={activityLog} />
        )}
      </div>
    </div>
  );
}

export default UserDetail;
