import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { bg, text, border } = useTheme();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "DB" },
    { path: "/faculty", label: "Faculty", icon: "FC" },
    { path: "/subjects", label: "Subjects", icon: "SB" },
    { path: "/rooms", label: "Rooms", icon: "RM" },
    { path: "/sections", label: "Sections", icon: "SC" },
    { path: "/timetables", label: "Timetable Generator", icon: "TT" },
    { path: "/settings", label: "Settings", icon: "ST" },
    
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-shrink-0 flex-col ${border} border-r ${bg.card} p-6 transition-transform duration-300 ease-in-out lg:static ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-12 flex flex-shrink-0 items-center justify-between">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-black">Slot</span>
            <span className="text-[#FF0436]">ify</span>
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white shadow-md"
                  : `${text.secondary} hover:bg-gray-100 hover:text-[#FF0436] dark:hover:bg-gray-700`
              }`}
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-current/10 text-xs font-bold">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={`flex-shrink-0 ${border} border-t pt-6`}>
          <p className={`text-xs ${text.tertiary}`}>App In Development Not Deployed</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
