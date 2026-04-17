import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { DonutChart } from './DonutChart';
import type { ChartDatum, ChartType } from './types';
import './Chart.css';

export type { ChartDatum, ChartType } from './types';

export type ChartProps = {
  type: ChartType;
  data: ChartDatum[];
  title?: string;
  height?: number;
  barColor?: string;
  lineColor?: string;
};

export function Chart({
  type,
  data,
  title,
  height,
  barColor,
  lineColor,
}: ChartProps) {
  return (
    <div className="chart-component">
      {title ? <h4 className="chart-title">{title}</h4> : null}
      {type === 'line' ? (
        <LineChart data={data} lineColor={lineColor} height={height} />
      ) : type === 'donut' ? (
        <DonutChart data={data} height={height} />
      ) : (
        <BarChart data={data} barColor={barColor} height={height} />
      )}
    </div>
  );
}

export default Chart;
