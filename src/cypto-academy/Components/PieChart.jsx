import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PieChart = ({ globalCryptoData }) => {

  const data = {
    labels: Object.keys(globalCryptoData.data.market_cap_percentage), // Cryptocurrency names
    datasets: [
      {
        label: "Market Dominance in %",
        data: Object.values(globalCryptoData.data.market_cap_percentage), // Market dominance values
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Makes the chart fill its container
    scales: {
      x: {
        barPercentage: 0.4, // Controls bar thickness (0.0 to 1.0, lower = thinner)
        categoryPercentage: 0.6, 
        grid: {
          drawOnChartArea: false, // Hide all inner grid lines
          drawTicks: false, // Hide small tick marks
        },
        border: {
          display: true, // Ensures the main vertical axis line is visible
          color: "#2A2E36",
          width: 1, // Makes it bold
        },
        ticks: { color: "#ffffff" } // White text on x-axis
      },
      y: {
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // Hide all inner grid lines
          drawTicks: false, // Hide small tick marks
        },
        border: {
          display: true, // Ensures the main horizontal axis line is visible
          color: "#2A2E36",
          width: 1, // Makes it bold
        },
        ticks: { color: "#ffffff" } // White text on y-axis
      }
    }
  };

  return (
    <div className="w-[90%] md:h-[500px] h-[300px] flex justify-center items-center mx-auto">
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  </div>
  );
};


export default PieChart;
