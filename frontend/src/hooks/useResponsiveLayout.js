// import { useState, useEffect } from "react";

// export const useResponsiveLayout = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);

//       // Auto-collapse sidebar on smaller screens, auto-expand on large
//       if (mobile) {
//         setIsCollapsed(true);
//       } else {
//         setIsCollapsed(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);

//   return { isCollapsed, isMobile, toggleSidebar, setIsCollapsed };
// };

import { useState, useEffect } from "react";

export const useResponsiveLayout = () => {
  // Safe initialization: checks if window exists to prevent errors during build processes
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  // Initialize the sidebar state based on the initial screen size
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId;

    const handleResize = () => {
      // Debounce: Wait 50ms before calculating to prevent performance lag during active window resizing
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentlyMobile = window.innerWidth < 768;

        setIsMobile((prevIsMobile) => {
          // Breakpoint Logic: Only auto-toggle the sidebar if the screen CROSSES the 768px threshold
          if (currentlyMobile !== prevIsMobile) {
            setIsCollapsed(currentlyMobile);
          }
          return currentlyMobile;
        });
      }, 50);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener and timeout on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return { isCollapsed, isMobile, toggleSidebar, setIsCollapsed };
};
