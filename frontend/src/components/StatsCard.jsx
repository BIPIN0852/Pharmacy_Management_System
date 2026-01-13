// import React from "react";

// const StatsCard = ({ title, value }) => {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         padding: "20px",
//         borderRadius: "10px",
//         flex: "1 1 200px",
//         boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//       }}
//     >
//       <h4>{title}</h4>
//       <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{value}</p>
//     </div>
//   );
// };

// export default StatsCard;

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * @param {string} title - The label of the statistic
 * @param {string|number} value - The main number to display
 * @param {React.Element} icon - Lucide icon component
 * @param {string} trend - Percentage change (e.g., "+12%")
 * @param {boolean} isLoss - If true, the trend will be red, otherwise green
 * @param {string} color - Bootstrap theme color (primary, success, warning, etc.)
 */
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoss,
  color = "primary",
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 transition-all hover-shadow">
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* Icon with dynamic background circle */}
        <div
          className={`bg-${color} bg-opacity-10 p-3 rounded-3 text-${color}`}
        >
          {Icon && <Icon size={24} />}
        </div>

        {/* Trend Indicator (Optional) */}
        {trend && (
          <div
            className={`d-flex align-items-center gap-1 small fw-bold ${
              isLoss ? "text-danger" : "text-success"
            }`}
          >
            {isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div>
        <h6 className="text-muted mb-1 small fw-bold text-uppercase tracking-wider">
          {title}
        </h6>
        <h3 className="fw-bold text-dark mb-0 ls-tight">{value}</h3>
      </div>

      <style>{`
        .hover-shadow:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; 
        }
        .transition-all { transition: all 0.3s ease; }
        .ls-tight { letter-spacing: -0.5px; }
        .tracking-wider { letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
};

export default StatsCard;
