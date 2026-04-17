import { useState } from 'react';
import type { ChartDatum } from './types';
import { DEFAULT_BAR_COLOR, DEFAULT_CHART_HEIGHT } from './types';

export type BarChartProps = {
  data: ChartDatum[];
  barColor?: string;
  height?: number;
};

export function BarChart({
  data,
  barColor = DEFAULT_BAR_COLOR,
  height = DEFAULT_CHART_HEIGHT,
}: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="chart-empty">No data</p>;
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="chart-bar-container" style={{ height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const isHovered = hovered === index;
        const itemKey = `${index}-${item.label}`;
        return (
          <div
            key={itemKey}
            className="chart-bar-wrapper"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHovered ? (
              <div className="chart-tooltip">
                <strong>{item.label}</strong>
                <br />
                {item.value.toLocaleString()}
              </div>
            ) : null}
            <div className="chart-bar">
              <div
                className="chart-bar-fill"
                style={{
                  backgroundColor: barColor,
                  opacity: isHovered ? 1 : 0.85,
                  height: `${barHeight}%`,
                }}
              />
            </div>
            <span className="chart-bar-label">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
