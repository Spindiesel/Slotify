import DashboardCard from "../components/DashboardCard";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const { bg, text, border } = useTheme();
  const recentActivities = [
    {
      id: 1,
      type: "faculty",
      message: "Dr. Sarah Johnson added as new faculty",
      timestamp: "2 hours ago",
      icon: "👨‍🏫",
    },
    {
      id: 2,
      type: "subject",
      message: "Advanced Mathematics course updated",
      timestamp: "4 hours ago",
      icon: "📚",
    },
    {
      id: 3,
      type: "room",
      message: "Room 201 added to the system",
      timestamp: "6 hours ago",
      icon: "🏫",
    },
    {
      id: 4,
      type: "timetable",
      message: "Spring 2024 timetable generated successfully",
      timestamp: "1 day ago",
      icon: "📅",
    },
    {
      id: 5,
      type: "faculty",
      message: "Prof. James Williams profile updated",
      timestamp: "2 days ago",
      icon: "👨‍🏫",
    },
  ];

  return (
    <div className={`w-full overflow-auto ${bg.page}`}>
      <div className="p-4 sm:p-6 lg:p-10 w-full">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${text.primary} mb-2 sm:mb-3`}>
            Welcome back, Admin! 👋
          </h1>
          <p className={`text-base sm:text-lg lg:text-xl ${text.secondary} font-medium`}>
            Here's what's happening with your institution today.
          </p>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 w-full">
          <DashboardCard
            title="Total Faculty"
            value="12"
            icon="👨‍🏫"
            growth="+2"
          />
          <DashboardCard
            title="Total Subjects"
            value="24"
            icon=" 📚"
            growth="+4"
          />
          <DashboardCard
            title="Total Rooms"
            value="8"
            icon="🏫"
            growth="+1"
          />
          <DashboardCard
            title="Timetables"
            value="3"
            icon="📅"
            growth="+1"
          />
        </div>

        {/* Activity and CTA Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* Recent Activity */}
          <div className="lg:col-span-2 w-full">
            <div className={`${bg.card} rounded-3xl p-6 sm:p-8 shadow-sm border ${border} w-full overflow-x-hidden`}>
              <h2 className={`text-xl sm:text-2xl font-bold ${text.primary} mb-6 sm:mb-8`}>
                Recent Activity
              </h2>

              <div className="space-y-1 w-full">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 sm:gap-4 py-4 sm:py-5 px-3 sm:px-4 rounded-2xl transition-all hover:opacity-75 ${
                      index !== recentActivities.length - 1 ? `border-b ${border}` : ""
                    }`}
                  >
                    {/* Timeline Indicator */}
                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#FF0436] shadow-sm"></div>
                      {index !== recentActivities.length - 1 && (
                        <div className={`w-0.5 h-12 ${bg.page === 'bg-gray-50' ? 'bg-gray-200' : 'bg-gray-600'} mt-2`}></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <p className={`${text.primary} font-semibold text-sm sm:text-base break-words`}>
                            {activity.message}
                          </p>
                          <p className={`${text.tertiary} text-xs sm:text-sm mt-1`}>
                            {activity.timestamp}
                          </p>
                        </div>
                        <span className="text-xl sm:text-2xl flex-shrink-0">{activity.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 px-4 rounded-2xl font-semibold text-[#FF0436] bg-red-50 hover:bg-red-100 transition-all border border-red-100 text-sm sm:text-base">
                View All Activity
              </button>
            </div>
          </div>

          {/* Generate Timetable CTA */}
          <div className="bg-gradient-to-br from-[#FF4E6B] to-[#FF0436] rounded-3xl p-6 sm:p-8 shadow-md text-white flex flex-col justify-between h-full transform hover:shadow-lg transition-all w-full">
            <div className="w-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center mb-4 sm:mb-6 text-2xl sm:text-3xl">
                📅
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                Generate Timetable
              </h3>
              <p className="text-white font-medium mb-6 sm:mb-8 text-sm sm:text-base">
                Create an optimized timetable for your institution with just a few clicks.
              </p>
            </div>

            <button className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-[#FF0436] bg-white hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
              Start Generating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;