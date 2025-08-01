import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components once outside the component
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: Record<string, number>;
  cutout?: string;
  colors?: string[];
  borderColors?: string[];
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

// Default color palette
const DEFAULT_COLORS = [
  'rgba(59, 130, 246, 0.5)', // Blue
  'rgba(34, 197, 94, 0.5)', // Green
  'rgba(251, 191, 36, 0.5)', // Yellow
  'rgba(168, 85, 247, 0.5)', // Purple
  'rgba(239, 68, 68, 0.5)', // Red
  'rgba(14, 165, 233, 0.5)', // Sky Blue
];

const DEFAULT_BORDER_COLORS = [
  'rgba(59, 130, 246, 1)', // Blue border
  'rgba(34, 197, 94, 1)', // Green border
  'rgba(251, 191, 36, 1)', // Yellow border
  'rgba(168, 85, 247, 1)', // Purple border
  'rgba(239, 68, 68, 1)', // Red border
  'rgba(14, 165, 233, 1)', // Sky Blue border
];

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  cutout = '40%',
  colors = DEFAULT_COLORS,
  borderColors = DEFAULT_BORDER_COLORS,
  showLegend = true,
  legendPosition = 'right',
}) => {
  // Memoize chart data to prevent unnecessary re-renders
  const chartData: ChartData<'doughnut'> = useMemo(() => {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);

    return {
      labels: dataKeys,
      datasets: [
        {
          data: dataValues,
          backgroundColor: colors.slice(0, dataKeys.length),
          borderColor: borderColors.slice(0, dataKeys.length),
          borderWidth: 1,
          cutout,
        },
      ],
    };
  }, [data, colors, borderColors, cutout]);

  // Memoize options to prevent unnecessary re-renders
  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          position: legendPosition,
          align: 'center' as const,
          labels: {
            color: 'rgba(156, 163, 175, 1)',
            padding: 8,
            usePointStyle: true,
            font: {
              size: 11,
            },
            boxWidth: 8,
            boxHeight: 8,
          },
        },
        title: {
          display: false,
        },
      },
      layout: {
        padding: {
          left: 8,
          right: 8,
          top: 8,
          bottom: 8,
        },
      },
      elements: {
        arc: {
          borderWidth: 1,
          borderJoinStyle: 'round' as const,
        },
      },
    }),
    [showLegend, legendPosition]
  );

  return <Doughnut data={chartData} options={options} />;
};
