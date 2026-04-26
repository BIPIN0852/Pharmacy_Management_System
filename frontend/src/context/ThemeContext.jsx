// import React, { createContext, useContext, useState, useEffect } from "react";

// const ThemeContext = createContext();

// export const useTheme = () => useContext(ThemeContext);

// export const ThemeProvider = ({ children }) => {
//   // Check localStorage on initial load to remember user's choice
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const savedTheme = localStorage.getItem("app-theme");
//     return savedTheme === "dark";
//   });

//   // Update localStorage and the HTML body class whenever it changes
//   useEffect(() => {
//     localStorage.setItem("app-theme", isDarkMode ? "dark" : "light");

//     if (isDarkMode) {
//       document.body.classList.add("theme-dark");
//       document.body.classList.remove("theme-light");
//     } else {
//       document.body.classList.add("theme-light");
//       document.body.classList.remove("theme-dark");
//     }
//   }, [isDarkMode]);

//   const toggleTheme = () => setIsDarkMode((prev) => !prev);

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check localStorage on initial load to remember user's choice
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme === "dark";
  });

  // Update localStorage and the HTML body class whenever it changes
  useEffect(() => {
    localStorage.setItem("app-theme", isDarkMode ? "dark" : "light");

    // Apply the class to the entire body so global CSS overrides can take effect
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
