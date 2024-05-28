import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", data1: 30, data2: 40, data3: 20 },
  { name: "Feb", data1: 40, data2: 30, data3: 25 },
  { name: "Mar", data1: 35, data2: 25, data3: 30 },
  // Add more data as needed
];

const MultipleLineGraph = () => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Line type="monotone" dataKey="data1" stroke="#8884d8" />
      <Line type="monotone" dataKey="data2" stroke="#82ca9d" />
      <Line type="monotone" dataKey="data3" stroke="#ffc658" />
    </LineChart>
  );
};

export default MultipleLineGraph;
