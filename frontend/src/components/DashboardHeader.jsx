import React from "react";

const DashboardHeader = ({ title, user }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <h1>{title}</h1>
      <div>
        <strong>{user?.name}</strong> ({user?.role})
      </div>
    </div>
  );
};

export default DashboardHeader;
