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
import { PIE_CHART_COLORS } from '../../constants/charts';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: Record<string, number>;
  colors?: string[];
  borderWidth?: number;
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

// Default color palette...

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = PIE_CHART_COLORS,
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
