import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-pink-100 h-screen p-6">

      <h1 className="text-4xl font-black tracking-tight mb-10">
         <span className="text-zinc-900">Slot</span>
         <span className="text-[#FF0436]">ify</span>
     </h1>

      <nav className="space-y-3">

        <Link
          to="/"
          className="block p-3 rounded-xl hover:bg-pink-50"
        >
          Dashboard
        </Link>

        <Link
          to="/faculty"
          className="block p-3 rounded-xl hover:bg-pink-50"
        >
          Faculty
        </Link>

        <Link
          to="/subjects"
          className="block p-3 rounded-xl hover:bg-pink-50"
        >
          Subjects
        </Link>

        <Link
          to="/rooms"
          className="block p-3 rounded-xl hover:bg-pink-50"
        >
          Rooms
        </Link>

      </nav>

    </div>
  );
}

export default Sidebar;