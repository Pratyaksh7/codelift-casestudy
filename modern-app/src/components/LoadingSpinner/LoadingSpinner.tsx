import type { CSSProperties } from 'react';
import './LoadingSpinner.css';

export type LoadingSpinnerProps = {
  size?: number;
  message?: string;
  fullPage?: boolean;
  color?: string;
};

const DEFAULT_SPINNER_COLOR = '#4a90d9';

export function LoadingSpinner({
  size = 40,
  message,
  fullPage = false,
  color = DEFAULT_SPINNER_COLOR,
}: LoadingSpinnerProps) {
  const circleStyle: CSSProperties = {
    width: size,
    height: size,
    borderTopColor: color,
  };

  return (
    <div className={fullPage ? 'spinner-fullpage' : 'spinner-inline'}>
      <div className="spinner-circle" style={circleStyle} />
      {message ? <p className="spinner-message">{message}</p> : null}
    </div>
  );
}

export default LoadingSpinner;
