function DashboardCard({ title, value, icon, growth = "+2" }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 w-full">
      {/* Icon Container */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center mb-4 sm:mb-6 text-2xl sm:text-3xl flex-shrink-0">
        {icon}
      </div>


      {/* Value */}
      <h2 className="text-4xl sm:text-5xl font-bold text-black mb-2">
        {value}
      </h2>


      {/* Title */}
      <p className="text-zinc-600 font-medium mb-4 text-sm sm:text-base">
        {title}
      </p>


      {/* Growth Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-[#FF0436] font-semibold text-sm">{growth}</span>
        <span className="text-zinc-500 text-xs sm:text-sm">this month</span>
      </div>
    </div>
  );
}

export default DashboardCard;