import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

function Chart() {
  const [rawData, setRawData] = useState([]);
  const [metric, setMetric] = useState('totalSalary');
  const [chartType, setChartType] = useState('bar');
  const [groupBy, setGroupBy] = useState('city');

  const fetchChartData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://dataforge-backend-kjsj.onrender.com/api/grouped-stats", {
        headers: { Authorization: `Bearer ${token}` },
        params: { groupBy }
      });
      setRawData(res.data);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  }, [groupBy]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const metricLabels = {
    totalSalary: "Total Salary (₹)",
    avgSalary: "Average Salary (₹)",
    count: "Employee Count"
  };

  const chartData = {
    labels: rawData.map(d => d._id || 'Unknown'),
    datasets: [
      {
        label: metricLabels[metric],
        data: rawData.map(d => d[metric]),
        backgroundColor: [
          "rgba(139, 92, 246, 0.6)",
          "rgba(244, 63, 94, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(59, 130, 246, 0.6)",
        ],
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
        borderRadius: chartType === 'bar' ? 8 : 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit', size: 11 }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y !== undefined ? context.parsed.y : (context.parsed.v || context.parsed);
            const formattedValue = metric.includes('Salary') 
              ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
              : value;
            return `${label}: ${formattedValue}`;
          }
        }
      }
    },
    scales: chartType !== 'pie' ? {
      y: {
        ticks: { 
          color: '#94a3b8',
          callback: (value) => {
            if (metric.includes('Salary')) {
              if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
              if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
              if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
              return `₹${value}`;
            }
            return value;
          }
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      }
    } : {}
  };

  return (
    <div className="glass-card p-6 rounded-3xl w-full overflow-hidden">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-slate-200 font-outfit uppercase tracking-wider">Segment Analytics</h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Segment Selector (GroupBy) */}
          <select 
            value={groupBy} 
            onChange={(e) => setGroupBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="city">By City</option>
            <option value="gender">By Gender</option>
            <option value="role">By Role</option>
            <option value="skills">By Skills</option>
            <option value="age">By Age</option>
          </select>

          {/* Metric Selector (Restored) */}
          <select 
            value={metric} 
            onChange={(e) => setMetric(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="totalSalary">Total Salary</option>
            <option value="avgSalary">Avg Salary</option>
            <option value="count">Employee Count</option>
          </select>

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            {['bar', 'pie', 'line'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  chartType === type 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] relative">
        {rawData.length > 0 ? (
          <>
            {chartType === 'bar' && <Bar data={chartData} options={options} />}
            {chartType === 'pie' && <Pie data={chartData} options={options} />}
            {chartType === 'line' && <Line data={chartData} options={options} />}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 italic">
            No segment data.
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
