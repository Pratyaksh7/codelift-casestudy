import type { ChartDatum } from './types';
import { DEFAULT_CHART_HEIGHT, DONUT_COLORS } from './types';

export type DonutChartProps = {
  data: ChartDatum[];
  height?: number;
};

const CENTER_RATIO = 0.55;

function buildConicGradient(data: ChartDatum[], total: number): string {
  const parts: string[] = [];
  let currentAngle = 0;
  data.forEach((item, index) => {
    const percentage = (item.value / total) * 100;
    const color = DONUT_COLORS[index % DONUT_COLORS.length];
    parts.push(`${color} ${currentAngle}% ${currentAngle + percentage}%`);
    currentAngle += percentage;
  });
  return parts.join(', ');
}

export function DonutChart({
  data,
  height = DEFAULT_CHART_HEIGHT,
}: DonutChartProps) {
  if (data.length === 0) {
    return <p className="chart-empty">No data</p>;
  }

  const size = height;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const gradient = buildConicGradient(data, total);

  return (
    <div className="chart-donut-container">
      <div
        className="chart-donut"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div
          className="chart-donut-center"
          style={{ width: size * CENTER_RATIO, height: size * CENTER_RATIO }}
        >
          {total.toLocaleString()}
        </div>
      </div>
      <div className="chart-donut-legend">
        {data.map((item, index) => {
          const itemKey = `${index}-${item.label}`;
          const color = DONUT_COLORS[index % DONUT_COLORS.length];
          return (
            <div key={itemKey} className="chart-legend-item">
              <span
                className="chart-legend-color"
                style={{ backgroundColor: color }}
              />
              <span className="chart-legend-label">{item.label}</span>
              <span className="chart-legend-value">
                {item.value.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DonutChart;
