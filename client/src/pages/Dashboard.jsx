import DashboardCard from "../components/DashboardCard";

function Dashboard() {
  return (
    
    <div className="flex-1 p-8">
        <h1 className="text-5xl text-red-500">DASHBOARD TEST</h1>
      <h2 className="text-3xl font-bold text-zinc-900 mb-8">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <DashboardCard
          title="Faculty"
          value="12"
        />

        <DashboardCard
          title="Subjects"
          value="24"
        />

        <DashboardCard
          title="Rooms"
          value="8"
        />

        <DashboardCard
          title="Timetables"
          value="1"
        />

      </div>

    </div>
  );
}

export default Dashboard;