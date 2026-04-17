import { getRelativeTime } from '../../utils/dateUtils';
import type { ActivityEntry, ActivityType } from '../../hooks/useUserDetail';
import './UserActivityTab.css';

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  product: '\uD83D\uDCE6',
  order: '\uD83D\uDCC3',
  settings: '\u2699',
  coupon: '\uD83C\uDF9F',
  auth: '\uD83D\uDD12',
};

function getActivityIcon(type: ActivityType): string {
  return ACTIVITY_ICONS[type] ?? '\u2022';
}

export type UserActivityTabProps = {
  activityLog: ActivityEntry[];
};

export function UserActivityTab({ activityLog }: UserActivityTabProps) {
  return (
    <div className="user-activity">
      <h4 className="user-activity__title">Recent Activity</h4>
      {activityLog.length === 0 ? (
        <p className="user-activity__empty">No activity recorded.</p>
      ) : (
        <div className="activity-timeline">
          {activityLog.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{getActivityIcon(activity.type)}</div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <span className="activity-time">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserActivityTab;
