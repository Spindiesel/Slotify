function FacultyTable({ faculty, onDelete }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Department</th>
            <th className="text-left p-4">Subjects</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {faculty.map((item) => (
            <tr
              key={item.id}
              className="border-t border-gray-100"
            >
              <td className="p-4 font-medium">
                {item.name}
              </td>

              <td className="p-4">
                {item.department}
              </td>

              <td className="p-4">
                {item.subjects}
              </td>

              <td className="p-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default FacultyTable;