import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("slotify-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("slotify-theme", theme);
  }, [theme]);

  // Theme color definitions
  const themes = {
    light: {
      bg: {
        page: "bg-gray-50",
        card: "bg-white",
      },
      text: {
        primary: "text-black",
        secondary: "text-gray-600",
        tertiary: "text-gray-500",
      },
      border: "border-gray-200",
      input: "bg-white text-black border-gray-300",
      table: {
        header: "bg-gray-50",
        row: "border-gray-100",
      },
    },
    dark: {
      bg: {
        page: "bg-gray-900",
        card: "bg-gray-800",
      },
      text: {
        primary: "text-white",
        secondary: "text-gray-300",
        tertiary: "text-gray-400",
      },
      border: "border-gray-700",
      input: "bg-gray-700 text-white border-gray-600",
      table: {
        header: "bg-gray-700",
        row: "border-gray-700",
      },
    },
  };

  const currentTheme = themes[theme];

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ...currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
