import { Link, useLocation } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/faculty", label: "Faculty", icon: "👨‍🏫" },
    { path: "/subjects", label: "Subjects", icon: "📚" },
    { path: "/rooms", label: "Rooms", icon: "🏫" },
    { path: "/timetables", label: "Timetables", icon: "📅" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col transition-transform duration-300 ease-in-out flex-shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="mb-12 flex items-center justify-between flex-shrink-0">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-black">Slot</span>
            <span className="text-[#FF0436]">ify</span>
          </h1>

          <Link to="/rooms" className="block px-4 py-3 rounded-2xl font-semibold text-zinc-700 hover:bg-pink-50 hover:text-[#FF0436] transition-all">
             Rooms
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white shadow-md"
                  : "text-zinc-700 hover:bg-gray-50 hover:text-[#FF0436]"
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
        

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 flex-shrink-0">
          <p className="text-xs text-zinc-500">App In Development Not Deployed</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;