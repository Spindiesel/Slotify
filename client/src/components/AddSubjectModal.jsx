import { useState } from "react";

function AddSubjectModal({ onClose, onAdd }) {

  const [name, setName] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [faculty, setFaculty] = useState("");

  const handleSubmit = () => {

    if (!name || !hoursPerWeek || !faculty) return;

    onAdd({
      id: Date.now(),
      name,
      hoursPerWeek,
      faculty,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">
          Add Subject
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Hours Per Week"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Select Faculty</option>
            <option>Dr Rao</option>
            <option>Dr Sharma</option>
            <option>Dr James</option>
          </select>

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
            Save Subject
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddSubjectModal;