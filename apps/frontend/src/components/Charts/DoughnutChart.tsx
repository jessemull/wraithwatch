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
import { DEFAULT_COLORS, DEFAULT_BORDER_COLORS } from '../../constants/charts';
import { capitalizeFirstLetter } from '../../util';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: Record<string, number>;
  cutout?: string;
  colors?: string[];
  borderColors?: string[];
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
}

// Default color palette...

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  cutout = '40%',
  colors = DEFAULT_COLORS,
  borderColors = DEFAULT_BORDER_COLORS,
  showLegend = true,
  legendPosition = 'right',
}) => {
  const chartData: ChartData<'doughnut'> = useMemo(() => {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);

    return {
      labels: dataKeys.map(capitalizeFirstLetter),
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
