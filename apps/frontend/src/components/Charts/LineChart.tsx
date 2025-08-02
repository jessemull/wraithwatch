import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { capitalizeFirstLetter } from '../../util';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: Record<string, number>;
  title: string;
  backgroundColor?: string;
  borderColor?: string;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointRadius?: number;
  pointHoverRadius?: number;
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  backgroundColor = 'rgba(74, 222, 128, 0.2)',
  borderColor = 'rgba(74, 222, 128, 1)',
  pointBackgroundColor = 'rgba(74, 222, 128, 0.5)',
  pointBorderColor = 'rgba(74, 222, 128, 1)',
  pointRadius = 6,
  pointHoverRadius = 8,
  borderWidth = 2,
  tension = 0,
  fill = true,
}) => {
  const chartData: ChartData<'line'> = useMemo(
    () => ({
      labels: Object.keys(data).map(capitalizeFirstLetter),
      datasets: [
        {
          label: title,
          data: Object.values(data),
          backgroundColor,
          borderColor,
          borderWidth,
          pointBackgroundColor,
          pointBorderColor,
          pointRadius,
          pointHoverRadius,
          tension,
          fill,
        },
      ],
    }),
    [
      data,
      title,
      backgroundColor,
      borderColor,
      pointBackgroundColor,
      pointBorderColor,
      pointRadius,
      pointHoverRadius,
      borderWidth,
      tension,
      fill,
    ]
  );

  const options: ChartOptions<'line'> = useMemo(
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
            text: 'Changes',
            color: 'rgba(156, 163, 175, 1)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
        x: {
          grid: {
            color: 'rgba(75, 85, 99, 0.2)',
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)',
          },
          title: {
            display: true,
            text: 'Date',
            color: 'rgba(156, 163, 175, 1)',
            font: {
              size: 12,
              weight: 'bold',
            },
          },
        },
      },
    }),
    []
  );

  return <Line data={chartData} options={options} />;
};
