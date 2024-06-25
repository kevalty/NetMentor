import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ProgressChart = ({ grades }) => {
  const data = {
    labels: grades.map(grade => grade.name), // Nombres de las pruebas
    datasets: [
      {
        label: 'Progreso de Calificaciones',
        data: grades.map(grade => grade.grades), // Notas de las pruebas
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ProgressChart;
