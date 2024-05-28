import React from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DonutChart = ({ data, height }) => {
  return (
    <div className="col-12">
      <ResponsiveContainer
        width="100%"
        height={height}
        className={"my-4 bg-dark shadow-lg "}
      >
        <PieChart className="py-2">
          <defs>
            <linearGradient id="colors" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
              <stop offset={"0%"} stopColor="#8884d8" stopOpacity={1} />
              <stop offset={"25%"} stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset={"50%"} stopColor="#8884d8" stopOpacity={0.6} />
              <stop offset={"75%"} stopColor="#8884d8" stopOpacity={0.4} />
              <stop offset={"100%"} stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60} // This sets the inner radius to create a donut chart
            fill="url(#colors)"
            // label
          />
          <Tooltip />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ right: 0, top: 90, lineHeight: "24px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
