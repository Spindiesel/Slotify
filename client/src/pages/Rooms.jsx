import { useState } from "react";

import RoomsTable from "../components/RoomsTable";
import AddRoomModal from "../components/AddRoomModal";

function Rooms() {

  const [showModal, setShowModal] = useState(false);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: "101",
      type: "Classroom",
      capacity: 60,
    },
    {
      id: 2,
      roomNumber: "Lab A",
      type: "Laboratory",
      capacity: 30,
    },
    {
      id: 3,
      roomNumber: "102",
      type: "Classroom",
      capacity: 60,
    },
  ]);

  const addRoom = (newRoom) => {
    setRooms([...rooms, newRoom]);
  };

  const deleteRoom = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    setRooms(
      rooms.filter((room) => room.id !== id)
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-black">
            Room Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage classrooms and laboratories.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white"
        >
          + Add Room
        </button>

      </div>

      <RoomsTable
        rooms={rooms}
        onDelete={deleteRoom}
      />

      {showModal && (
        <AddRoomModal
          onClose={() => setShowModal(false)}
          onAdd={addRoom}
        />
      )}

    </div>
  );
}

export default Rooms;
