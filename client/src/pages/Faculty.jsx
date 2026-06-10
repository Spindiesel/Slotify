import { useState } from "react";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

import FacultyTable from "../components/FacultyTable";
import AddFacultyModal from "../components/AddFacultyModal";

function Faculty() {
  const { bg, text, border } = useTheme();

  const [showModal, setShowModal] = useState(false);
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/faculty")
    .then((res) => res.json())
    .then((data) => setFaculty(data))
    .catch((err) => console.error(err));
}, []);

  const addFaculty = (newFaculty) => {
    setFaculty([...faculty, newFaculty]);
  };

 const deleteFaculty = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this faculty member from the pool?"
  );

  if (!confirmDelete) return;

  await fetch(
    `http://localhost:5000/api/faculty/${id}`,
    {
      method: "DELETE",
    }
  );

  setFaculty(
    faculty.filter((item) => item.id !== id)
  );
};

  return (
    <div className={`w-full overflow-auto ${bg.page}`}>
      <div className="p-4 sm:p-6 lg:p-8 w-full">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

          <div>
            <h1 className={`text-3xl sm:text-4xl font-bold ${text.primary}`}>
              Faculty Management
            </h1>

            <p className={`${text.secondary} mt-2 text-sm sm:text-base`}>
              Manage all faculty members.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-medium whitespace-nowrap"
          >
            + Add Faculty
          </button>

        </div>

        <FacultyTable
          faculty={faculty}
          onDelete={deleteFaculty}
        />

        {showModal && (
          <AddFacultyModal
            onClose={() => setShowModal(false)}
            onAdd={addFaculty}
          />
        )}

      </div>
    </div>
  );
}

export default Faculty;