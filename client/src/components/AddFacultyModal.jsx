import { useState } from "react";
import {useEffect} from "react";

function AddFacultyModal({ onClose, onAdd }) {

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subjects, setSubjects] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const response = await fetch(
    "http://localhost:5000/api/faculty",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        department,
        subjects,
      }),
    }
  );

  const savedFaculty = await response.json();

  onAdd(savedFaculty);

  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

      <div className="bg-white rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-black mb-6">
          Add Faculty
        </h2>

        <div className="space-y-4">
          <label className="block font-medium text-zinc-900">
            Faculty Name
          </label>

          <input
            type="text"
            placeholder="Faculty Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <label className="block font-medium text-zinc-900">
            Department
          </label>

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border rounded-xl p-3"
          />

          <label className="block font-medium text-zinc-900">
            Subject
          </label>

          <input
            type="text"
            placeholder="Subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
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
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddFacultyModal;
