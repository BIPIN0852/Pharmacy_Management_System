// import React from "react";
// import {
//   BarChart as ReBarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const BarChart = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <ReBarChart data={data}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="Orders" fill="#8884d8" />
//       </ReBarChart>
//     </ResponsiveContainer>
//   );
// };

// export default BarChart;

import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <ReBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          {/* Grid lines for better readability */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            allowDecimals={false} // Orders are usually whole numbers
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          <Legend wrapperStyle={{ paddingTop: "10px" }} />

          {/* Improved Bar Color (Bootstrap Primary Blue) */}
          <Bar
            dataKey="Orders"
            fill="#0d6efd"
            barSize={40}
            radius={[4, 4, 0, 0]} // Rounded top corners
            name="Total Orders" // Label for Legend
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
