import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = ({ progress }) => {
  // Data for the pie chart
  const pieData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [progress, 100 - progress],
        backgroundColor: ['#4caf50', '#e0e0e0'], // Green for completed, gray for remaining
        hoverBackgroundColor: ['#388e3c', '#bdbdbd'],
      },
    ],
  };

  return (
    <div className="progress-chart-container">
      <h3>Progress Chart</h3>
      <div className="pie-chart-container">
        <h4>Completion Status</h4>
        <Pie data={pieData} options={{ responsive: true }} />
      </div>

      {/* Internal CSS */}
      <style>{`
        .progress-chart-container {
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .pie-chart-container {
          margin-top: 20px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }

        h4 {
          font-size: 1.25rem;
          font-weight: 500;
          color: #555;
        }

        .pie-chart-container canvas {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ProgressChart;
