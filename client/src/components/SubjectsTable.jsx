function SubjectsTable({ subjects, onDelete }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Subject Name</th>
            <th className="text-left p-4">Hours / Week</th>
            <th className="text-left p-4">Faculty</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr
              key={subject.id}
              className="border-t border-gray-100"
            >
              <td className="p-4 font-medium">
                {subject.name}
              </td>

              <td className="p-4">
                {subject.hoursPerWeek}
              </td>

              <td className="p-4">
                {subject.faculty}
              </td>

              <td className="p-4">
                <button
                  onClick={() => onDelete(subject.id)}
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

export default SubjectsTable;