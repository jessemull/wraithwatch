import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: Record<string, number>;
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
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
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
  };

  return <Pie data={chartData} options={options} />;
}; 