function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-red-50 flex items-center justify-center p-6">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(255,4,54,0.12)] border border-pink-100 p-10 text-center hover:scale-[1.01] transition-all duration-300">
       
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] flex items-center justify-center text-white text-3xl font-bold">
          S
        </div>

        <h1 className="mt-6 text-5xl font-black tracking-tight">
          <span className="text-zinc-900">Slot</span>
          <span className="text-[#FF0436]">ify</span>
        </h1> 

        <p className="mt-3 text-gray-500">
          Smart Timetable Generation System
        </p>

        <button className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
  Get Started
</button>

      </div>

    </div>
  );
}

export default App;