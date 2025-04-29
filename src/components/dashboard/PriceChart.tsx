import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

interface PriceChartProps {
  data: {
    timestamps: string[];
    prices: number[];
  };
  timeframe: "1h" | "24h" | "7d" | "30d" | "all";
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  timeframe, 
  height = 300 
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx || !data.prices.length) return;

    // Create gradient for area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255, 69, 0, 0.5)");
    gradient.addColorStop(1, "rgba(255, 69, 0, 0.0)");

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.timestamps,
        datasets: [
          {
            label: "Price",
            data: data.prices,
            borderColor: "#ff4500",
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#ff4500",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#252525",
            titleColor: "#ffffff",
            bodyColor: "#b3b3b3",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `$${context.parsed.y.toFixed(6)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: "#b3b3b3",
              maxRotation: 0,
              callback: (value, index, values) => {
                // Different tick formats based on timeframe
                if (timeframe === "1h" && index % 6 === 0) return data.timestamps[index];
                if (timeframe === "24h" && index % 4 === 0) return data.timestamps[index];
                if (timeframe === "7d" && index % 24 === 0) return data.timestamps[index];
                if (timeframe === "30d" && index % 7 === 0) return data.timestamps[index];
                if (timeframe === "all" && index % 30 === 0) return data.timestamps[index];
                return "";
              }
            }
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              color: "#b3b3b3",
              callback: (value) => {
                return "$" + value;
              }
            }
          }
        }
      }
    });

    return () => {
      // Cleanup
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, timeframe, height]);

  return (
    <div className="price-chart-container">
      <canvas ref={chartRef} height={height}></canvas>
    </div>
  );
};

export default PriceChart;
