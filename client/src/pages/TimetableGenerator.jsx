import { useState } from "react";

function generateSchedule(
  subjects,
  workingDays,
  periodsPerDay,
  allowFreePeriods,
  freePeriodDistribution
) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ].slice(0, workingDays);

  const timetable = {};
  days.forEach((day) => {
    timetable[day] = Array(periodsPerDay).fill(null);
  });

  // Create subject pool
  const subjectPool = [];
  subjects.forEach((subject) => {
    for (let i = 0; i < subject.hoursPerWeek; i++) {
      subjectPool.push({
        subject: subject.name,
        faculty: subject.faculty,
      });
    }
  });

  // Shuffle subject pool
  for (let i = subjectPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [subjectPool[i], subjectPool[j]] = [
      subjectPool[j],
      subjectPool[i],
    ];
  }

  // Create all available slots
  const allSlots = [];
  days.forEach((day) => {
    for (let p = 0; p < periodsPerDay; p++) {
      allSlots.push({
        day,
        period: p,
      });
    }
  });

  // Shuffle slots if random distribution
  if (freePeriodDistribution === "random") {
    allSlots.sort(() => Math.random() - 0.5);
  }

  // Assign subjects to slots
  let index = 0;
  for (let i = 0; i < allSlots.length && index < subjectPool.length; i++) {
    const slot = allSlots[i];
    timetable[slot.day][slot.period] = subjectPool[index];
    index++;
  }

  return timetable;
}

function TimetableGenerator() {
  const subjects = [
    {
      name: "DBMS",
      faculty: "Dr Rao",
      hoursPerWeek: 4,
    },
    {
      name: "Operating Systems",
      faculty: "Dr Sharma",
      hoursPerWeek: 3,
    },
    {
      name: "Computer Networks",
      faculty: "Dr Patel",
      hoursPerWeek: 3,
    },
    {
      name: "Java",
      faculty: "Dr Kumar",
      hoursPerWeek: 4,
    },
  ];

  const [generatedTimetable, setGeneratedTimetable] =
  useState(null);

  const [editingSlot, setEditingSlot] =
  useState(null);

   const [selectedSubject, setSelectedSubject] =
  useState("");

  const [workingDays, setWorkingDays] =
    useState(5);

  const [periodsPerDay, setPeriodsPerDay] =
    useState(5);

  const [selectedSlot, setSelectedSlot] =
  useState(null);

  const [versions, setVersions] =
  useState([]);

const [currentVersion, setCurrentVersion] =
  useState(null);

  const [allowFreePeriods, setAllowFreePeriods] =
    useState(true);

  const [freePeriodDistribution, setFreePeriodDistribution] =
  useState("balanced");

  const [swapMode, setSwapMode] = useState(false);

  const [conflictMessage, setConflictMessage] = useState("");

  const checkFacultyConflict = (facultyName, dayIndex, periodIndex) => {
  if (!generatedTimetable) return false;

  const slotsInPeriod =
    generatedTimetable[
      Object.keys(generatedTimetable)[dayIndex]
    ];

  if (!slotsInPeriod) return false;

  const slot = slotsInPeriod[periodIndex];

  if (slot && slot.faculty === facultyName) {
    return true;
  }

  return false;
};

const facultyList = [
  "Dr Rao",
  "Dr Sharma",
  "Dr Patel",
  "Dr Kumar",
];

const sectionList = [
  "CSE-A",
  "CSE-B",
  "CSE-C",
];

const [selectedFaculty, setSelectedFaculty] =
  useState(facultyList);

const [selectedSections, setSelectedSections] =
  useState(sectionList);






const handleGenerate = () => {

  const filteredSubjects =
    subjects.filter((subject) =>
      selectedFaculty.includes(
        subject.faculty
      )
    );

  const result = generateSchedule(
    filteredSubjects,
    workingDays,
    periodsPerDay,
    allowFreePeriods,
    freePeriodDistribution
  );

  setGeneratedTimetable(result);

  const newVersion = {
    id: Date.now(),
    name: `Version ${versions.length + 1}`,
    timetable: result,
  };

  setVersions((prev) => [
    ...prev,
    newVersion,
  ]);

  setCurrentVersion(newVersion.id);
};

  return (
    <div className="w-full overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 w-full">

        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
          Timetable Generator
        </h1>

        <p className="text-zinc-600 mb-8 text-sm sm:text-base">
          Generate smart academic timetables.
        </p>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">

          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-6">
            Generator Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium text-zinc-900">
                Working Days
              </label>

              <input
                type="number"
                value={workingDays}
                onChange={(e) =>
                  setWorkingDays(Number(e.target.value))
                }
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-zinc-900">
                Periods Per Day
              </label>

                <input
                    type="number"
                value={periodsPerDay}
                onChange={(e) =>
                  setPeriodsPerDay(Number(e.target.value))
                }
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
              />
            </div>

          </div>

          <div className="mt-6">

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                checked={allowFreePeriods}
                onChange={(e) =>
                  setAllowFreePeriods(e.target.checked)
                }
                className="w-4 h-4 rounded"
              />

              <span className="font-medium text-zinc-900">Allow Free Periods</span>

            </label>

            {allowFreePeriods && (
              <div className="mt-6">

                <label className="block mb-3 font-medium text-zinc-900">
                  Free Period Distribution
                </label>

                <select
                  value={freePeriodDistribution}
                  onChange={(e) =>
                    setFreePeriodDistribution(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
                >
                  <option value="balanced">
                    Balanced
                  </option>

                  <option value="end">
                    End of Day
                  </option>

                  <option value="random">
                    Random
                  </option>
                </select>

              </div>
            )}

          </div>

         <div className="mt-6">

  <label className="block mb-3 font-medium text-zinc-900">
    Faculty Selection
  </label>

  <div className="flex gap-2 mb-4">

    <button
      type="button"
      onClick={() =>
        setSelectedFaculty(
          facultyList
        )
      }
      className="px-3 py-2 rounded-lg bg-gray-100"
    >
      Select All
    </button>

    <button
      type="button"
      onClick={() =>
        setSelectedFaculty([])
      }
      className="px-3 py-2 rounded-lg bg-gray-100"
    >
      Clear All
    </button>

  </div>

  <div className="grid grid-cols-2 gap-2 mb-6">

    {facultyList.map((faculty) => (

      <label
        key={faculty}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedFaculty.includes(
            faculty
          )}
          onChange={() => {

            if (
              selectedFaculty.includes(
                faculty
              )
            ) {

              setSelectedFaculty(
                selectedFaculty.filter(
                  (f) => f !== faculty
                )
              );

            } else {

              setSelectedFaculty([
                ...selectedFaculty,
                faculty,
              ]);

            }

          }}
        />

        {faculty}

      </label>

    ))}

  </div>
<div className="mt-6">

  <label className="block mb-3 font-medium text-zinc-900">
    Section Selection
  </label>

  <div className="flex gap-2 mb-4">

    <button
      type="button"
      onClick={() =>
        setSelectedSections(sectionList)
      }
      className="px-3 py-2 rounded-lg bg-gray-100"
    >
      Select All
    </button>

    <button
      type="button"
      onClick={() =>
        setSelectedSections([])
      }
      className="px-3 py-2 rounded-lg bg-gray-100"
    >
      Clear All
    </button>

  </div>

  <div className="grid grid-cols-2 gap-2">

    {sectionList.map((section) => (

      <label
        key={section}
        className="flex items-center gap-2"
      >

        <input
          type="checkbox"
          checked={selectedSections.includes(
            section
          )}
          onChange={() => {

            if (
              selectedSections.includes(
                section
              )
            ) {

              setSelectedSections(
                selectedSections.filter(
                  (s) => s !== section
                )
              );

            } else {

              setSelectedSections([
                ...selectedSections,
                section,
              ]);

            }

          }}
        />

        {section}

      </label>

    ))}

  </div>

</div>
  <button
  
    onClick={handleGenerate}
    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-semibold hover:shadow-lg transition-all"
  >
    Generate Timetable
  </button>

</div>

        </div>

        {generatedTimetable && (
          

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 overflow-x-auto">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

              <h2 className="text-xl sm:text-2xl font-semibold text-black">
                Generated Timetable
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSwapMode(!swapMode);
                    setSelectedSlot(null);
                  }}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    swapMode
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {swapMode ? 'Swap Mode ON' : 'Swap Mode OFF'}
                </button>

                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl bg-red-50 text-[#FF0436] font-semibold hover:bg-red-100 transition-all"
                >
                  Regenerate
                </button>
              </div>

            </div>

            {versions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-3">
                  Timetable Versions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => {
                        setGeneratedTimetable(version.timetable);
                        setCurrentVersion(version.id);
                        setSelectedSlot(null);
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentVersion === version.id
                          ? 'bg-[#FF0436] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {version.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
                

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b border-gray-200">

                  <th className="p-3 text-left font-semibold text-black">
                    Day
                  </th>

                  {Array.from(
                    { length: periodsPerDay },
                    (_, i) => (
                      <th
                        key={i}
                        className="p-3 text-center font-semibold text-black"
                      >
                        P{i + 1}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {Object.entries(
  generatedTimetable
).map(([day, periods]) => (

                  <tr
                    key={day}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                    <td className="p-3 font-semibold text-zinc-900">
                      {day}
                    </td>

                    {periods.map(
                      (period, index) => (
                        <td
  key={index}
  className={`p-3 text-center cursor-pointer transition ${
    swapMode
      ? selectedSlot && selectedSlot.day === day && selectedSlot.periodIndex === index
        ? 'bg-pink-200'
        : 'hover:bg-pink-50'
      : 'hover:bg-pink-50'
  }`}
  onClick={() => {
    if (swapMode) {
      // Swap mode logic
      if (selectedSlot === null) {
        // First click: select this cell
        setSelectedSlot({ day, periodIndex: index });
      } else {
        // Second click: swap
        const temp = generatedTimetable[selectedSlot.day][selectedSlot.periodIndex];
        const updated = { ...generatedTimetable };
        updated[selectedSlot.day][selectedSlot.periodIndex] = generatedTimetable[day][index];
        updated[day][index] = temp;
        setGeneratedTimetable(updated);
        setSelectedSlot(null);
      }
    } else {
      // Edit mode logic (existing)
      if (period === null || period === "Free") return;
      setEditingSlot({
        day,
        periodIndex: index,
        currentSubject: period,
      });
      setSelectedSubject(period.subject);
    }
  }}
>
  {period === null || period === "Free" ? (
    <span>Free</span>
  ) : (
    <div>
      <div className="font-medium text-black">{period.subject}</div>
      <div className="text-xs text-gray-500">{period.faculty}</div>
    </div>
  )}
</td>
                      )
                    )}

                  </tr>

                ))}

              </tbody>

              </table>

          </div>

              )}

      </div>
      {editingSlot && (

  <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

    <div className="bg-white rounded-3xl p-8 w-full max-w-md">

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Timetable Slot
      </h2>

      <p className="mb-4 text-gray-600">
        {editingSlot.day} - P{editingSlot.periodIndex + 1}
      </p>

      {conflictMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-xl">
          <p className="text-red-700 font-semibold text-sm">
            ⚠ Faculty Conflict Detected
          </p>
          <p className="text-red-700 text-sm mt-1">
            {conflictMessage}
          </p>
        </div>
      )}

      <select
  value={selectedSubject}
  onChange={(e) =>
    setSelectedSubject(e.target.value)
  }
  className="w-full border rounded-xl p-3"
>

  <option value="Free">
    Free Period
  </option>

  {subjects.map((subject) => (

    <option
      key={subject.name}
      value={subject.name}
    >
      {subject.name}
    </option>

  ))}

</select>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => {
            setEditingSlot(null);
            setConflictMessage("");
          }}
          className="px-4 py-2 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            // Check for conflicts
            if (selectedSubject !== "Free") {
              const selected = subjects.find((s) => s.name === selectedSubject);
              const dayIndex = Object.keys(generatedTimetable).indexOf(editingSlot.day);
              const slotsInPeriod = generatedTimetable[editingSlot.day];
              
              // Check if this faculty is already assigned in this period (excluding current slot)
              let hasConflict = false;
              for (let i = 0; i < slotsInPeriod.length; i++) {
                if (i !== editingSlot.periodIndex) {
                  const slot = slotsInPeriod[i];
                  if (slot && slot.faculty === selected.faculty) {
                    hasConflict = true;
                    break;
                  }
                }
              }
              
              if (hasConflict) {
                setConflictMessage(`${selected.faculty} is already assigned during this period.`);
                return;
              }
            }
            
            // Clear conflict message if no conflict
            setConflictMessage("");
            
            const updated = {
              ...generatedTimetable,
            };

            if (selectedSubject === "Free") {
              updated[editingSlot.day][editingSlot.periodIndex] = null;
            } else {
              const selected = subjects.find((s) => s.name === selectedSubject);
              updated[editingSlot.day][editingSlot.periodIndex] = {
                subject: selected.name,
                faculty: selected.faculty,
              };
            }

            setGeneratedTimetable(updated);

            setEditingSlot(null);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white"
        >
          Save
        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
}


export default TimetableGenerator;