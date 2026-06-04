import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Subjects from "./pages/Subjects";
import Rooms from "./pages/Rooms";
import TimetableGenerator from "./pages/TimetableGenerator";
import Sections from "./pages/Sections";
import Settings from "./pages/Settings";


function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { bg } = useTheme();

  return (
    <div className={`flex h-screen w-full overflow-hidden ${bg.page}`}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 w-full h-full overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/timetables" element={<TimetableGenerator />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;