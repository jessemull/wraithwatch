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

interface BarChartProps {
  data: Record<string, number>;
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  maxBarThickness?: number;
  borderRadius?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  backgroundColor = 'rgba(59, 130, 246, 0.8)',
  borderColor = 'rgba(59, 130, 246, 1)',
  maxBarThickness = 30,
  borderRadius = 3,
}) => {
  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels: Object.keys(data).map(capitalizeFirstLetter),
      datasets: [
        {
          label: title,
          data: Object.values(data),
          backgroundColor: backgroundColor.replace('0.8', '0.3'),
          barThickness: 'flex',
          maxBarThickness,
        },
      ],
    }),
    [data, title, backgroundColor, maxBarThickness]
  );

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
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
        y: {
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
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)',
          },
          title: {
            display: true,
            text: 'Severity Level',
            color: 'rgba(156, 163, 175, 1)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
      },
      elements: {
        bar: {
          borderRadius,
          borderSkipped: 'start' as const,
          borderWidth: 1,
          borderColor,
        },
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
        },
      },
    }),
    [borderColor, borderRadius]
  );

  return <Bar data={chartData} options={options} />;
};
