import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: Record<string, number>;
  colors?: string[];
  borderWidth?: number;
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

// Default color palette
const DEFAULT_COLORS = [
  'rgba(59, 130, 246, 0.8)', // Blue
  'rgba(34, 197, 94, 0.8)', // Green
  'rgba(251, 191, 36, 0.8)', // Yellow
  'rgba(168, 85, 247, 0.8)', // Purple
  'rgba(239, 68, 68, 0.8)', // Red
  'rgba(14, 165, 233, 0.8)', // Sky Blue
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  borderWidth = 1,
  showLegend = true,
  legendPosition = 'bottom',
}) => {
  const chartData: ChartData<'pie'> = useMemo(() => {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);

    return {
      labels: dataKeys,
      datasets: [
        {
          data: dataValues,
          backgroundColor: colors.slice(0, dataKeys.length),
          borderColor: colors
            .slice(0, dataKeys.length)
            .map(color => color.replace('0.8', '1')),
          borderWidth,
        },
      ],
    };
  }, [data, colors, borderWidth]);

  const options: ChartOptions<'pie'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: legendPosition,
          labels: {
            color: 'rgba(156, 163, 175, 1)',
            padding: 10,
            usePointStyle: true,
          },
        },
        title: {
          display: false,
        },
      },
    }),
    [showLegend, legendPosition]
  );

  return <Pie data={chartData} options={options} />;
};
