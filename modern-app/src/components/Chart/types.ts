export type ChartDatum = {
  label: string;
  value: number;
};

export type ChartType = 'bar' | 'line' | 'donut';

export const DEFAULT_BAR_COLOR = '#4a90d9';
export const DEFAULT_LINE_COLOR = '#4a90d9';
export const DEFAULT_CHART_HEIGHT = 200;

export const DONUT_COLORS: readonly string[] = [
  '#4a90d9',
  '#27ae60',
  '#e74c3c',
  '#f39c12',
  '#9b59b6',
  '#1abc9c',
];
