import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
  title,
  backgroundColor = 'rgba(59, 130, 246, 0.8)',
  borderColor = 'rgba(59, 130, 246, 1)',
}) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: title,
        data: Object.values(data),
        backgroundColor: backgroundColor.replace('0.8', '0.3'),
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  const options = {
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
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
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
        borderSkipped: 'start',
        borderWidth: 1,
        borderColor,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
