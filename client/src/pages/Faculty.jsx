import { useState } from "react";

import FacultyTable from "../components/FacultyTable";
import AddFacultyModal from "../components/AddFacultyModal";

function Faculty() {

  const [showModal, setShowModal] = useState(false);

  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: "Dr Rao",
      department: "CSE",
      subjects: "DBMS, CN",
    },
    {
      id: 2,
      name: "Dr Sharma",
      department: "CSE",
      subjects: "Operating Systems",
    },
  ]);

  const addFaculty = (newFaculty) => {
    setFaculty([...faculty, newFaculty]);
  };

  const deleteFaculty = (id) => {
    setFaculty(
      faculty.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-black">
            Faculty Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage all faculty members.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-medium"
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
  );
}

export default Faculty;