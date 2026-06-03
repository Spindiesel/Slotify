import { useState } from "react";

function AddRoomModal({ onClose, onAdd }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = () => {
    if (!roomNumber || !type || !capacity) return;

    onAdd({
      id: Date.now(),
      roomNumber,
      type,
      capacity,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">
          Add Room
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select Type</option>
            <option>Classroom</option>
            <option>Laboratory</option>
          </select>

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white"
          >
            Save Room
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddRoomModal;