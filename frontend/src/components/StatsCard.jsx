import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        flex: "1 1 200px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h4>{title}</h4>
      <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};

export default StatsCard;
