// import React from "react";
// import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
// import { useTheme } from "../context/ThemeContext";
// import { Menu } from "lucide-react";

// const DashboardLayout = ({ SidebarComponent, HeaderComponent, children }) => {
//   const { isCollapsed, isMobile, toggleSidebar, setIsCollapsed } =
//     useResponsiveLayout();

//   const { isDarkMode } = useTheme();
//   const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";

//   return (
//     <div
//       className={`master-layout-wrapper transition-all ${isCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}
//       style={{ backgroundColor: themeBg, minHeight: "100vh" }}
//     >
//       {/* 1. MASTER SIDEBAR */}
//       <SidebarComponent
//         collapsed={isCollapsed}
//         setCollapsed={setIsCollapsed}
//         isMobile={isMobile}
//       />

//       {/* 2. MAIN AREA */}
//       <div
//         className="master-main-content d-flex flex-column transition-all"
//         style={{ backgroundColor: themeBg, height: "100vh" }}
//       >
//         {/* Mobile Toggle Trigger (Float) */}
//         {isMobile && (
//           <button
//             className="btn position-fixed bottom-0 end-0 m-3 z-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center hover-lift border-0"
//             onClick={toggleSidebar}
//             style={{
//               width: "56px",
//               height: "56px",
//               backgroundColor: "#007185",
//               color: "#ffffff",
//             }}
//           >
//             <Menu size={26} />
//           </button>
//         )}

//         {/* Dynamic Header Passed as Prop */}
//         <HeaderComponent toggleSidebar={toggleSidebar} />

//         {/* Main Content Render Area */}
//         <main className="p-3 p-md-4 flex-grow-1 overflow-auto custom-scrollbar transition-all">
//           {children}
//         </main>
//       </div>

//       <style>{`
//         /* Smooth Dark/Light Mode Transitions */
//         .transition-all {
//           transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         /* Floating Button Animation */
//         .hover-lift {
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .hover-lift:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 8px 20px rgba(0, 113, 133, 0.4) !important;
//         }

//         /* Custom Scrollbar for Main Area */
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardLayout;

import React from "react";
import { useResponsiveLayout } from "../hooks/useResponsiveLayout";
import { useTheme } from "../context/ThemeContext";
import { Menu } from "lucide-react";

const DashboardLayout = ({ SidebarComponent, HeaderComponent, children }) => {
  const { isCollapsed, isMobile, toggleSidebar, setIsCollapsed } =
    useResponsiveLayout();

  const { isDarkMode } = useTheme();
  const themeBg = isDarkMode ? "var(--bg-primary)" : "#f0f2f2";

  return (
    <div
      className={`master-layout-wrapper d-flex transition-all ${
        isCollapsed ? "sidebar-collapsed" : "sidebar-open"
      }`}
      style={{
        backgroundColor: themeBg,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. MOBILE OVERLAY (Dismisses sidebar when clicked outside) */}
      {isMobile && !isCollapsed && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-2"
          onClick={() => setIsCollapsed(true)}
          style={{ transition: "opacity 0.3s ease" }}
        />
      )}

      {/* 2. MASTER SIDEBAR */}
      <SidebarComponent
        collapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />

      {/* 3. MAIN AREA */}
      <div
        className="master-main-content d-flex flex-column flex-grow-1 transition-all w-100"
        style={{
          backgroundColor: themeBg,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Mobile Toggle Trigger (Float) */}
        {isMobile && (
          <button
            className="btn position-fixed bottom-0 end-0 m-3 m-md-4 z-3 rounded-circle shadow-lg d-flex align-items-center justify-content-center hover-lift border-0"
            onClick={toggleSidebar}
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#007185",
              color: "#ffffff",
            }}
            aria-label="Toggle Menu"
          >
            <Menu size={26} />
          </button>
        )}

        {/* Dynamic Header Passed as Prop */}
        <div className="z-1 shadow-sm flex-shrink-0">
          <HeaderComponent toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content Render Area */}
        <main className="p-3 p-md-4 flex-grow-1 overflow-auto custom-scrollbar transition-all position-relative">
          {children}
        </main>
      </div>

      <style>{`
        /* Layout Structure Basics */
        .master-layout-wrapper {
          position: relative;
          width: 100%;
        }

        /* Smooth Dark/Light Mode Transitions */
        .transition-all { 
          transition: background-color 0.3s ease, color 0.3s ease, margin 0.3s ease, width 0.3s ease; 
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
