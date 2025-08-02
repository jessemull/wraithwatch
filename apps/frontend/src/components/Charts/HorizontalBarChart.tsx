import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { capitalizeFirstLetter } from '../../util';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HorizontalBarChartProps {
  data: Record<string, number>;
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  maxBarThickness?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  title,
  backgroundColor = 'rgba(59, 130, 246, 0.8)',
  borderColor = 'rgba(59, 130, 246, 1)',
  borderRadius = 4,
  maxBarThickness = 30,
}) => {
  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels: Object.keys(data).map(capitalizeFirstLetter),
      datasets: [
        {
          label: title,
          data: Object.values(data),
          backgroundColor: backgroundColor.replace('0.8', '0.3'),
          borderRadius,
          barThickness: 'flex',
          maxBarThickness,
        },
      ],
    }),
    [data, title, backgroundColor, borderRadius, maxBarThickness]
  );

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: 'rgba(75, 85, 99, 0.2)',
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)',
          },
          title: {
            display: true,
            text: 'Count',
            color: 'rgba(156, 163, 175, 1)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)',
          },
          title: {
            display: true,
            text: 'Agent Status',
            color: 'rgba(156, 163, 175, 1)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
        },
      },
      elements: {
        bar: {
          borderRadius: 1,
          borderSkipped: 'start' as const,
          borderWidth: 1,
          borderColor,
        },
      },
    }),
    [borderColor]
  );

  return <Bar data={chartData} options={options} />;
};
