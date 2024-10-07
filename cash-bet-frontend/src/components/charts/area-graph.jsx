import React, { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip alert-primary">
        <p>
          {label}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AreaGraph = ({ data, height, XAxisKey, dataKey, fill, color_id }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className="my-4 bg-dark shadow-lg"
    >
      <AreaChart
        className="py-2"
        data={data}
        // fill="#2451B7"
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={color_id} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={fill} stopOpacity={0.8} />
            <stop offset={"25%"} stopColor={fill} stopOpacity={0.6} />
            <stop offset={"50%"} stopColor={fill} stopOpacity={0.4} />
            <stop offset={"75%"} stopColor={fill} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={XAxisKey}
          stroke="#FFFFFF"
          axisLine={false}
          tickLine={false}
        />
        <YAxis axisLine={false} tickLine={false} stroke="#FFFFFF" />
        <Tooltip content={CustomTooltip} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={fill}
          fill={`url(#${color_id})`}
          activeDot={true}
        />

        <CartesianGrid opacity={0.3} vertical={false} strokeDasharray="3 3" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaGraph;
