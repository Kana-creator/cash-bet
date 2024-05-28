import React from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartExample = () => {
  const data = [
    { name: "Category A", value: 30, color: "#ff0000" },
    { name: "Category B", value: 45 },
    { name: "Category C", value: 28 },
    { name: "Category D", value: 55 },
    { name: "Category E", value: 40 },
    // Add more data points as needed
  ];

  return (
    <div className="col-12 bg-secondary shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartExample;
