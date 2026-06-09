import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

import SubjectsTable from "../components/SubjectsTable";
import AddSubjectModal from "../components/AddSubjectModal";

function Subjects() {
  const { bg, text } = useTheme();

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
    <div className={`w-full overflow-auto ${bg.page}`}>
      <div className="w-full p-4 sm:p-6 lg:p-8">

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className={`text-3xl font-bold sm:text-4xl ${text.primary}`}>
            Subject Management
          </h1>

          <p className={`${text.secondary} mt-2 text-sm sm:text-base font-medium`}>
            Manage all academic subjects.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="whitespace-nowrap rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] px-5 py-3 font-medium text-white"
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
    </div>
  );
}

export default Subjects;
