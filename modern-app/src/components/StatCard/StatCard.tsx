import { useCountUp } from '../../hooks/useCountUp';
import './StatCard.css';

export type StatCardProps = {
  label: string;
  value: number;
  iconBg: string;
  icon: string;
  prefix?: string;
};

export function StatCard({ label, value, iconBg, icon, prefix }: StatCardProps) {
  const animated = useCountUp(value);
  return (
    <div className="dashboard__stat-card">
      <div className="dashboard__stat-icon" style={{ backgroundColor: iconBg }}>
        <span>{icon}</span>
      </div>
      <div className="dashboard__stat-info">
        <p className="dashboard__stat-label">{label}</p>
        <h3 className="dashboard__stat-number">
          {prefix ?? ''}
          {animated.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

export default StatCard;
