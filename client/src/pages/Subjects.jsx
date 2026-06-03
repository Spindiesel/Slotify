import { useState } from "react";

import SubjectsTable from "../components/SubjectsTable";
import AddSubjectModal from "../components/AddSubjectModal";

function Subjects() {

  const [showModal, setShowModal] = useState(false);

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "DBMS",
      hoursPerWeek: 4,
      faculty: "Dr Rao",
    },
    {
      id: 2,
      name: "Operating Systems",
      hoursPerWeek: 3,
      faculty: "Dr Sharma",
    },
    {
        if:3,
        name:"Computer Networks",
        hoursPerWeek:3,
        faculty:"Subhash",

    },
  ]);

  const addSubject = (newSubject) => {
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this subject?"
  );

  if (!confirmDelete) return;

  setSubjects(
    subjects.filter((subject) => subject.id !== id)
  );
};

  return (
    <div className="flex-1 bg-gray-50 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-black">
            Subject Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage all academic subjects.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-medium"
        >
          + Add Subject
        </button>

      </div>

      <SubjectsTable
        subjects={subjects}
        onDelete={deleteSubject}
      />

      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onAdd={addSubject}
        />
      )}

    </div>
  );
}

export default Subjects;