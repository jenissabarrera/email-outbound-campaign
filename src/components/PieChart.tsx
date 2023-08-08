import React, { useState } from "react";

const PieChart: React.FC = () => {
  // Initialize the state with some initial data
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  }>({
    labels: ["Category A", "Category B", "Category C"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  });

  // Function to update the chart data dynamically
  const updateChartData = () => {
    // Generate some random data for demonstration purposes
    const newData = {
      labels: ["Category D", "Category E", "Category F"],
      datasets: [
        {
          data: [200, 150, 250],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    setChartData(newData);
  };

  return (
    <div>
      <h1>Analytics Pie Chart</h1>
      <PieChart data={chartData} />
      <button onClick={updateChartData}>Update Chart Data</button>
    </div>
  );
};

export default PieChart;
