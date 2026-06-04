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
      subjectPool.push(subject.name);
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
      hoursPerWeek: 4,
    },
    {
      name: "Operating Systems",
      hoursPerWeek: 3,
    },
    {
      name: "Computer Networks",
      hoursPerWeek: 3,
    },
    {
      name: "Java",
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

  const [allowFreePeriods, setAllowFreePeriods] =
    useState(true);

  const [freePeriodDistribution, setFreePeriodDistribution] =
  useState("balanced");

  const [swapMode, setSwapMode] = useState(false);

  const handleGenerate = () => {
    const result = generateSchedule(
  subjects,
  workingDays,
  periodsPerDay,
  allowFreePeriods,
  freePeriodDistribution
);

    setGeneratedTimetable(result);
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

          <button
            onClick={handleGenerate}
            className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-semibold hover:shadow-lg transition-all"
          >
            Generate Timetable
          </button>

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
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >

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
      if (period === "Free") return;
      setEditingSlot({
        day,
        periodIndex: index,
        currentSubject: period,
      });
      setSelectedSubject(period);
    }
  }}
>
  {period}
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

      <h2 className="text-2xl font-bold mb-6">
        Edit Timetable Slot
      </h2>

      <p className="mb-4 text-gray-600">
        {editingSlot.day} - P{editingSlot.periodIndex + 1}
      </p>

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
          onClick={() => setEditingSlot(null)}
          className="px-4 py-2 border rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={() => {

            const updated = {
              ...generatedTimetable,
            };

            updated[
              editingSlot.day
            ][editingSlot.periodIndex] =
              selectedSubject;

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