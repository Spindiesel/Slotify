function RoomsTable({ rooms, onDelete }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4">Room Number</th>
            <th className="text-left p-4">Type</th>
            <th className="text-left p-4">Capacity</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-t border-gray-100">
              <td className="p-4 font-medium">{room.roomNumber}</td>
              <td className="p-4">{room.type}</td>
              <td className="p-4">{room.capacity}</td>
              <td className="p-4">
                <button
                  onClick={() => onDelete(room.id)}
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

export default RoomsTable;