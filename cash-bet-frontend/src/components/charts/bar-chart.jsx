import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import VerticalTick from "./vertical-tiks-xaxis";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip alert-primary alert bg-dark text-light">
        <p className="p-0 m-0">{label}</p>
        <p className="p-0 m-0 text-danger">
          {"Our shops : " + payload[0].value}
        </p>
        <p className="p-0 m-0 text-primary">
          {"Partner shops : " + payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

const BarGraph = ({ data, height, fill, fill2 }) => {
  console.log(data);
  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className="my-4 bg-dark shadow-lg"
    >
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        className="py-4 p-0"
      >
        <defs>
          <linearGradient id="fill" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={fill} stopOpacity={0.8} />
            <stop offset={"25%"} stopColor={fill} stopOpacity={0.6} />
            <stop offset={"50%"} stopColor={fill} stopOpacity={0.4} />
            <stop offset={"75%"} stopColor={fill} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <defs>
          <linearGradient id="fill2" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={fill2} stopOpacity={0.8} />
            <stop offset={"25%"} stopColor={fill2} stopOpacity={0.6} />
            <stop offset={"50%"} stopColor={fill2} stopOpacity={0.4} />
            <stop offset={"75%"} stopColor={fill2} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          stroke="#FFFFFF"
        />
        <YAxis stroke="#FFFFFF" tickLine={false} axisLine={false} />
        <Tooltip content={CustomTooltip} />
        {/* <Legend /> */}
        <Bar dataKey="value" fill="url(#fill)" />
        <Bar dataKey="value2" fill="url(#fill2)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
