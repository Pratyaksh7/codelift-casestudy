import type { ChartDatum } from './types';
import { DEFAULT_CHART_HEIGHT, DEFAULT_LINE_COLOR } from './types';

export type LineChartProps = {
  data: ChartDatum[];
  lineColor?: string;
  height?: number;
};

const POINT_SPACING = 60;
const POINT_OFFSET = 30;
const VERTICAL_PADDING = 40;
const BOTTOM_OFFSET = 20;

export function LineChart({
  data,
  lineColor = DEFAULT_LINE_COLOR,
  height = DEFAULT_CHART_HEIGHT,
}: LineChartProps) {
  if (data.length === 0) {
    return <p className="chart-empty">No data</p>;
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const width = data.length * POINT_SPACING;

  const computeY = (value: number): number =>
    height - (value / maxValue) * (height - VERTICAL_PADDING) - BOTTOM_OFFSET;

  const computeX = (index: number): number => index * POINT_SPACING + POINT_OFFSET;

  const points = data
    .map((item, index) => `${computeX(index)},${computeY(item.value)}`)
    .join(' ');

  return (
    <div className="chart-line-container" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <polyline fill="none" stroke={lineColor} strokeWidth="2" points={points} />
        {data.map((item, index) => {
          const itemKey = `${index}-${item.label}`;
          return (
            <circle
              key={itemKey}
              cx={computeX(index)}
              cy={computeY(item.value)}
              r="4"
              fill={lineColor}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="chart-line-labels">
        {data.map((item, index) => {
          const itemKey = `${index}-${item.label}`;
          return (
            <span key={itemKey} className="chart-bar-label chart-line-label">
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default LineChart;
