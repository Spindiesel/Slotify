import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

import RoomsTable from "../components/RoomsTable";
import AddRoomModal from "../components/AddRoomModal";

function Rooms() {
  const { bg, text } = useTheme();

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
    <div className={`w-full overflow-auto ${bg.page}`}>
      <div className="w-full p-4 sm:p-6 lg:p-8">

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className={`text-3xl font-bold sm:text-4xl ${text.primary}`}>
            Room Management
          </h1>

          <p className={`${text.secondary} mt-2 text-sm sm:text-base font-medium`}>
            Manage classrooms and laboratories.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] px-5 py-3 font-medium text-white"
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
    </div>
  );
}

export default Rooms;
