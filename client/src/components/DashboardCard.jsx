function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <p className="text-3xl font-bold text-[#FF0436] mt-2">
        {value}
      </p>
    </div>
  );
}

export default DashboardCard;