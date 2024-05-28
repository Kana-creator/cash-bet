import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FormatMoney, FormatMoneyExt } from "../activities/format-money";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip alert-primary">
        <p>
          {label}: {FormatMoney(payload[0].value, 2)}
        </p>
      </div>
    );
  }
  return null;
};

const LineGraph = ({ data, XAxisKey, height }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className="my-4 py-4 bg-dark shadow-lg"
    >
      <LineChart data={data}>
        <CartesianGrid vertical={false} opacity={0.3} strokeDasharray="3 3" />
        <XAxis
          dataKey={XAxisKey}
          stroke="#FFFFFF"
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="#FFFFFF"
          axisLine={false}
          tickLine={false}
          tickFormatter={(tick) => FormatMoneyExt(tick, 2)}
          tickCount={10}
        />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Line
          type="monotone"
          dataKey="subscription"
          stroke="#8884d8"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
