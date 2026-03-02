import React from "react";
import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
import { Menu } from "lucide-react";

const DashboardLayout = ({ SidebarComponent, HeaderComponent, children }) => {
  const { isCollapsed, isMobile, toggleSidebar, setIsCollapsed } =
    useResponsiveLayout();

  return (
    <div
      className={`master-layout-wrapper ${isCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}
    >
      {/* 1. MASTER SIDEBAR */}
      <SidebarComponent
        collapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />

      {/* 2. MAIN AREA */}
      <div className="master-main-content">
        {/* Mobile Toggle Trigger (Float) */}
        {isMobile && (
          <button
            className="btn btn-dark position-fixed bottom-0 end-0 m-3 z-3 rounded-circle shadow"
            onClick={toggleSidebar}
            style={{ width: "50px", height: "50px" }}
          >
            <Menu size={24} />
          </button>
        )}

        <HeaderComponent toggleSidebar={toggleSidebar} />

        <main className="p-3 p-md-4 flex-grow-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
