// import React from "react";
// import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
// import { Menu } from "lucide-react";

// const DashboardLayout = ({ SidebarComponent, HeaderComponent, children }) => {
//   const { isCollapsed, isMobile, toggleSidebar, setIsCollapsed } =
//     useResponsiveLayout();

//   return (
//     <div
//       className={`master-layout-wrapper ${isCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}
//     >
//       {/* 1. MASTER SIDEBAR */}
//       <SidebarComponent
//         collapsed={isCollapsed}
//         setCollapsed={setIsCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. MAIN AREA */}
//       <div className="master-main-content">
//         {/* Mobile Toggle Trigger (Float) */}
//         {isMobile && (
//           <button
//             className="btn btn-dark position-fixed bottom-0 end-0 m-3 z-3 rounded-circle shadow"
//             onClick={toggleSidebar}
//             style={{ width: "50px", height: "50px" }}
//           >
//             <Menu size={24} />
//           </button>
//         )}

//         <HeaderComponent toggleSidebar={toggleSidebar} />

//         <main className="p-3 p-md-4 flex-grow-1">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import React from "react";
import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
import { useTheme } from "../context/ThemeContext"; // ✅ Import Theme Context
import { Menu } from "lucide-react";

const DashboardLayout = ({ SidebarComponent, HeaderComponent, children }) => {
  const { isCollapsed, isMobile, toggleSidebar, setIsCollapsed } =
    useResponsiveLayout();

  // ✅ Extract theme variables
  const { isDarkMode } = useTheme();
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";

  return (
    <div
      className={`master-layout-wrapper transition-all ${isCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}
      style={{ backgroundColor: themeBg, minHeight: "100vh" }}
    >
      {/* 1. MASTER SIDEBAR */}
      <SidebarComponent
        collapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />

      {/* 2. MAIN AREA */}
      <div
        className="master-main-content d-flex flex-column transition-all"
        style={{ backgroundColor: themeBg, height: "100vh" }}
      >
        {/* Mobile Toggle Trigger (Float) */}
        {isMobile && (
          <button
            className="btn position-fixed bottom-0 end-0 m-3 z-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center hover-lift border-0"
            onClick={toggleSidebar}
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#007185", // ✅ Brand Color
              color: "#ffffff",
            }}
          >
            <Menu size={26} />
          </button>
        )}

        {/* Dynamic Header Passed as Prop */}
        <HeaderComponent toggleSidebar={toggleSidebar} />

        {/* Main Content Render Area */}
        <main className="p-3 p-md-4 flex-grow-1 overflow-auto custom-scrollbar transition-all">
          {children}
        </main>
      </div>

      <style>{`
        /* Smooth Dark/Light Mode Transitions */
        .transition-all { 
          transition: background-color 0.3s ease, color 0.3s ease; 
        }
        
        /* Floating Button Animation */
        .hover-lift { 
          transition: transform 0.2s ease, box-shadow 0.2s ease; 
        }
        .hover-lift:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 8px 20px rgba(0, 113, 133, 0.4) !important; 
        }
        
        /* Custom Scrollbar for Main Area */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
