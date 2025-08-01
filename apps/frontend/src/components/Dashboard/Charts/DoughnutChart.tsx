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
    'rgba(59, 130, 246, 0.5)',   // Blue
    'rgba(34, 197, 94, 0.5)',    // Green
    'rgba(251, 191, 36, 0.5)',   // Yellow
    'rgba(168, 85, 247, 0.5)',   // Purple
    'rgba(239, 68, 68, 0.5)',    // Red
    'rgba(14, 165, 233, 0.5)',   // Sky Blue
  ];

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: colors.slice(0, Object.keys(data).length),
        borderColor: [
          'rgba(59, 130, 246, 1)',   // Blue border
          'rgba(34, 197, 94, 1)',    // Green border
          'rgba(251, 191, 36, 1)',   // Yellow border
          'rgba(168, 85, 247, 1)',   // Purple border
          'rgba(239, 68, 68, 1)',    // Red border
          'rgba(14, 165, 233, 1)',   // Sky Blue border
        ].slice(0, Object.keys(data).length),
        borderWidth: 1,
        cutout: '40%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
        borderJoinStyle: 'round',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}; 