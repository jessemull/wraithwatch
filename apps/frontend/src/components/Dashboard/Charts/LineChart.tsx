import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  backgroundColor = 'rgba(74, 222, 128, 0.2)',
  borderColor = 'rgba(74, 222, 128, 1)',
}) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: title,
        data: Object.values(data),
        backgroundColor,
        borderColor,
        borderWidth: 2,
        pointBackgroundColor: 'rgba(74, 222, 128, 0.5)', // Transparent green fill
        pointBorderColor: 'rgba(74, 222, 128, 1)', // Solid green border
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0,
        fill: true,
      },
    ],
  };

  const options = {
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
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 1)',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
