import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: Record<string, number>;
  title: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(251, 191, 36, 0.8)',   // Yellow
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(14, 165, 233, 0.8)',   // Sky Blue
  ];

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: colors.slice(0, Object.keys(data).length),
        borderColor: colors.slice(0, Object.keys(data).length).map(color => 
          color.replace('0.8', '1')
        ),
        borderWidth: 2,
        cutout: '60%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'start' as const,
        labels: {
          color: 'rgba(156, 163, 175, 1)',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 11,
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      title: {
        display: false,
      },
    },
    layout: {
      padding: {
        left: 16,
        right: 16,
        top: 16,
        bottom: 16,
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}; 