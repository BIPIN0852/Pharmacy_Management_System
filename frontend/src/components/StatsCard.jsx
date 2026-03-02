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

// import React from "react";
// import { TrendingUp, TrendingDown } from "lucide-react";

// /**
//  * @param {string} title - The label of the statistic
//  * @param {string|number} value - The main number to display
//  * @param {React.Element} icon - Lucide icon component
//  * @param {string} trend - Percentage change (e.g., "+12%")
//  * @param {boolean} isLoss - If true, the trend will be red, otherwise green
//  * @param {string} color - Bootstrap theme color (primary, success, warning, etc.)
//  */
// const StatsCard = ({
//   title,
//   value,
//   icon: Icon,
//   trend,
//   isLoss,
//   color = "primary",
// }) => {
//   return (
//     <div className="card border-0 shadow-sm rounded-4 p-3 h-100 transition-all hover-shadow">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         {/* Icon with dynamic background circle */}
//         <div
//           className={`bg-${color} bg-opacity-10 p-3 rounded-3 text-${color}`}
//         >
//           {Icon && <Icon size={24} />}
//         </div>

//         {/* Trend Indicator (Optional) */}
//         {trend && (
//           <div
//             className={`d-flex align-items-center gap-1 small fw-bold ${
//               isLoss ? "text-danger" : "text-success"
//             }`}
//           >
//             {isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
//             <span>{trend}</span>
//           </div>
//         )}
//       </div>

//       <div>
//         <h6 className="text-muted mb-1 small fw-bold text-uppercase tracking-wider">
//           {title}
//         </h6>
//         <h3 className="fw-bold text-dark mb-0 ls-tight">{value}</h3>
//       </div>

//       <style>{`
//         .hover-shadow:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
//         }
//         .transition-all { transition: all 0.3s ease; }
//         .ls-tight { letter-spacing: -0.5px; }
//         .tracking-wider { letter-spacing: 0.05em; }
//       `}</style>
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
 * @param {boolean} isLoss - If true, the trend will point down
 * @param {string} color - Bootstrap theme color (primary, success, warning, info, danger)
 */
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isLoss,
  color = "primary",
}) => {
  // Maps standard Bootstrap colors to our modern vibrant gradients
  const getGradientClass = (colorName) => {
    switch (colorName) {
      case "primary":
        return "gradient-card-1"; // Purple/Blue
      case "success":
        return "gradient-card-2"; // Emerald/Teal
      case "warning":
        return "gradient-card-3"; // Orange/Pink
      case "info":
        return "gradient-card-4"; // Blue/Cyan
      case "danger":
        return "gradient-card-5"; // Red/Coral
      default:
        return "gradient-card-1";
    }
  };

  const gradientClass = getGradientClass(color);

  return (
    <div
      className={`card ${gradientClass} border-0 shadow-lg rounded-4 h-100 hover-lift text-white overflow-hidden position-relative`}
    >
      <div className="card-body p-4 position-relative z-1">
        <div className="d-flex justify-content-between align-items-start mb-3">
          {/* Frosted Glass Icon Box */}
          <div className="glass-icon-box">{Icon && <Icon size={24} />}</div>

          {/* Frosted Glass Trend Indicator (Optional) */}
          {trend && (
            <div className="glass-badge small fw-bold d-flex align-items-center gap-1">
              {isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              <span>{trend}</span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="small text-uppercase fw-bolder tracking-wider mb-1 opacity-75">
          {title}
        </div>
        <h2 className="fw-bolder mb-0 display-6">{value}</h2>
      </div>

      {/* Decorative Background Circle */}
      <div className="card-decorator-circle"></div>

      {/* Embedded CSS specific to the StatsCard */}
      <style>{`
        /* Vibrant Gradient Themes */
        .gradient-card-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .gradient-card-2 { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .gradient-card-3 { background: linear-gradient(135deg, #FF8008 0%, #FFC837 100%); }
        .gradient-card-4 { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); }
        .gradient-card-5 { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }

        /* Glassmorphism Elements */
        .glass-icon-box {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .glass-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 50px;
        }

        /* Decorative Background Elements */
        .card-decorator-circle {
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: -30px;
          right: -30px;
          z-index: 0;
        }

        /* Typography & Spacing */
        .tracking-wider { letter-spacing: 0.05em; }

        /* Hover Animations */
        .transition-all { transition: all 0.3s ease; }
        .hover-lift { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; }
        .hover-lift:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important; 
        }
        .hover-lift:active { transform: translateY(0); }
      `}</style>
    </div>
  );
};

export default StatsCard;
