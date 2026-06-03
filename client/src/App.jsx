import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Subjects from "./pages/Subjects";
import Rooms from "./pages/Rooms";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 w-full h-full overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/rooms" element={<Rooms />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;