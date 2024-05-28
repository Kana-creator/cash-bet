import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

const data = [{ name: "Completion", uv: [90, 10], fill: "#8884d8" }];

const GaugeChart = () => {
  return (
    <RadialBarChart
      width={300}
      height={300}
      cx={150}
      cy={150}
      innerRadius={150}
      outerRadius={100}
      barSize={10}
      data={data}
    >
      <RadialBar
        // minAngle={15}
        label={{ position: "insideStart", fill: "#fff" }}
        background
        dataKey="uv"
      />
      <Legend
        iconSize={10}
        width={120}
        height={140}
        layout="vertical"
        verticalAlign="middle"
        align="right"
      />
      <Tooltip />
    </RadialBarChart>
  );
};

export default GaugeChart;
