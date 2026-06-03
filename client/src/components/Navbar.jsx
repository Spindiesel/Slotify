function Navbar({ onMenuClick }) {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 lg:px-8 flex-shrink-0 z-20">
      <div className="w-full flex items-center justify-between h-full">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div></div>

        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          <button className="relative p-2 text-zinc-600 hover:text-zinc-900 transition-colors flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 sm:pl-6 border-l border-gray-200 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              AD
            </div>
            <div className="text-sm hidden md:block">
              <p className="font-semibold text-zinc-900">Admin</p>
              <p className="text-zinc-600">Administrator</p>
            </div>
          </div>

          <div className="sm:hidden flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-semibold text-sm">
              AD
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;