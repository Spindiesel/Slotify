import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme, bg, text, border } = useTheme();

  const [accentColor, setAccentColor] =
    useState("#FF0436");

  const colors = [
    "#FF0436",
    "#FF4E6B",
    "#3B82F6",
    "#22C55E",
    "#A855F7",
  ];

  return (
    <div className={`flex-1 ${bg.page} p-8`}>

      <h1 className={`text-4xl font-bold ${text.primary} mb-2`}>
        Settings
      </h1>

      <p className={`${text.secondary} mb-8 font-medium`}>
        Customize your Slotify experience.
      </p>

      <div className={`${bg.card} rounded-3xl p-6 shadow-sm ${border} border mb-8`}>

        <h2 className={`text-2xl font-semibold ${text.primary} mb-4`}>
          Theme
        </h2>

        <div className="flex gap-4">

          <button
            onClick={() => toggleTheme("light")}
            className={`px-5 py-3 rounded-xl font-medium ${
              theme === "light"
                ? "bg-[#FF0436] text-white"
                : `${bg.page} ${text.secondary} border ${border}`
            }`}
          >
            Light
          </button>

          <button
            onClick={() => toggleTheme("dark")}
            className={`px-5 py-3 rounded-xl font-medium ${
              theme === "dark"
                ? "bg-[#FF0436] text-white"
                : `${bg.page} ${text.secondary} border ${border}`
            }`}
          >
            Dark
          </button>

        </div>

      </div>

      <div className={`${bg.card} rounded-3xl p-6 shadow-sm ${border} border`}>

        <h2 className={`text-2xl font-semibold ${text.primary} mb-4`}>
          Accent Color
        </h2>

        <div className="flex gap-4">

          {colors.map((color) => (

            <button
              key={color}
              onClick={() =>
                setAccentColor(color)
              }
              className="w-12 h-12 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: accentColor === color ? color : "#ccc",
              }}
            />

          ))}

        </div>

        <div className="mt-6">

          <button
            className="px-6 py-3 rounded-xl text-white font-semibold"
            style={{
              backgroundColor: accentColor,
            }}
          >
            Preview Button
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;
