import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SAVED_TIMETABLES_KEY = "slotify_saved_timetables";

function createFacultySchedule(facultyList) {
  return facultyList.reduce((schedule, faculty) => {
    schedule[faculty] = {};
    return schedule;
  }, {});
}

function isFacultyAvailable(faculty, day, period, facultySchedule) {
  if (!faculty) {
    return true;
  }

  return !facultySchedule[faculty]?.[`${day}-${period}`];
}

function validateFacultyConflicts(timetables) {
  const facultyAssignments = {};
  const conflicts = [];

  Object.entries(timetables).forEach(([section, timetable]) => {
    Object.entries(timetable).forEach(([day, periods]) => {
      periods.forEach((slot, periodIndex) => {
        if (!slot?.faculty) {
          return;
        }

        const key = `${slot.faculty}-${day}-${periodIndex}`;
        if (!facultyAssignments[key]) {
          facultyAssignments[key] = [];
        }

        facultyAssignments[key].push({
          faculty: slot.faculty,
          section,
          day,
          periodIndex,
        });
      });
    });
  });

  Object.values(facultyAssignments).forEach((assignments) => {
    if (assignments.length > 1) {
      conflicts.push(assignments);
    }
  });

  return conflicts;
}

function generateScheduleLegacy(
  section,
  subjects,
  workingDays,
  periodsPerDay,
  allowFreePeriods,
  freePeriodDistribution,
  facultySchedule
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

  const subjectPool = [];
  subjects.forEach((subject) => {
    for (let i = 0; i < subject.hoursPerWeek; i += 1) {
      subjectPool.push({
        subject: subject.name,
        faculty: subject.faculty,
      });
    }
  });

  for (let i = subjectPool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [subjectPool[i], subjectPool[j]] = [subjectPool[j], subjectPool[i]];
  }

  const allSlots = [];
  days.forEach((day) => {
    for (let period = 0; period < periodsPerDay; period += 1) {
      allSlots.push({ day, period });
    }
  });

  if (freePeriodDistribution === "random") {
    allSlots.sort(() => Math.random() - 0.5);
  }

  subjectPool.forEach((entry) => {
    for (let i = 0; i < allSlots.length; i += 1) {
      const slot = allSlots[i];

      if (timetable[slot.day][slot.period] !== null) {
        continue;
      }

      if (
        !isFacultyAvailable(
          entry.faculty,
          slot.day,
          slot.period,
          facultySchedule
        )
      ) {
        continue;
      }

      timetable[slot.day][slot.period] = entry;
      facultySchedule[entry.faculty][`${slot.day}-${slot.period}`] = section;
      break;
    }
  });

  if (!allowFreePeriods) {
    return timetable;
  }

  if (freePeriodDistribution === "end") {
    Object.keys(timetable).forEach((day) => {
      const scheduled = timetable[day].filter(Boolean);
      const freeCount = periodsPerDay - scheduled.length;
      timetable[day] = [...scheduled, ...Array(freeCount).fill(null)].slice(
        0,
        periodsPerDay
      );
    });
  }

  return timetable;
}

function createSmartSubjectPool(subjects) {
  const remainingHours = subjects.map((subject) => ({
    ...subject,
    remainingHours: subject.hoursPerWeek,
  }));
  const subjectPool = [];

  while (remainingHours.some((subject) => subject.remainingHours > 0)) {
    remainingHours
      .filter((subject) => subject.remainingHours > 0)
      .sort((a, b) => b.remainingHours - a.remainingHours)
      .forEach((subject) => {
        subjectPool.push({
          subject: subject.name,
          faculty: subject.faculty,
        });
        subject.remainingHours -= 1;
      });
  }

  return subjectPool;
}

function getCandidateSlotScore({
  slot,
  timetable,
  dayLoads,
  days,
  periodsPerDay,
  subjectDayAssignments,
  freePeriodDistribution,
  subjectName,
}) {
  const assignedDays = subjectDayAssignments[subjectName] ?? [];
  const dayIndex = days.indexOf(slot.day);
  const occupiedPeriods = timetable[slot.day]
    .map((period, index) => (period ? index : -1))
    .filter((index) => index !== -1);

  let score = dayLoads[slot.day] * 1.2;

  if (assignedDays.length > 0) {
    const nearestDayDistance = Math.min(
      ...assignedDays.map((assignedDayIndex) => Math.abs(assignedDayIndex - dayIndex))
    );

    if (nearestDayDistance === 1) {
      score += 5;
    } else if (nearestDayDistance === 2) {
      score += 1;
    }
  }

  if (occupiedPeriods.length === 0) {
    score += slot.period * 0.8;
  } else {
    const minOccupied = Math.min(...occupiedPeriods);
    const maxOccupied = Math.max(...occupiedPeriods);
    const isAdjacentToBlock =
      slot.period === minOccupied - 1 || slot.period === maxOccupied + 1;
    const isInsideExistingBlock =
      slot.period > minOccupied && slot.period < maxOccupied;

    if (isAdjacentToBlock) {
      score -= 2.5;
    } else if (isInsideExistingBlock) {
      score -= 1.5;
    } else {
      score += 2;
    }
  }

  if (slot.period === 0 || slot.period === periodsPerDay - 1) {
    score -= 1;
  }

  if (freePeriodDistribution === "end") {
    score += slot.period * 0.8;
  } else if (freePeriodDistribution === "random") {
    score += Math.random();
  } else {
    const middle = (periodsPerDay - 1) / 2;
    score += Math.abs(slot.period - middle) * 0.15;
  }

  return score;
}

function generateScheduleSmart(
  section,
  subjects,
  workingDays,
  periodsPerDay,
  allowFreePeriods,
  freePeriodDistribution,
  facultySchedule
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
  const dayLoads = {};

  days.forEach((day) => {
    timetable[day] = Array(periodsPerDay).fill(null);
    dayLoads[day] = 0;
  });

  const subjectPool = createSmartSubjectPool(subjects);
  const subjectDayAssignments = {};
  subjects.forEach((subject) => {
    subjectDayAssignments[subject.name] = [];
  });

  const allSlots = [];
  days.forEach((day) => {
    for (let period = 0; period < periodsPerDay; period += 1) {
      allSlots.push({ day, period });
    }
  });

  subjectPool.forEach((entry) => {
    const candidates = allSlots
      .filter((slot) => timetable[slot.day][slot.period] === null)
      .filter((slot) => {
        const assignedDays = subjectDayAssignments[entry.subject] ?? [];
        const dayIndex = days.indexOf(slot.day);

        if (assignedDays.includes(dayIndex)) {
          return false;
        }

        return isFacultyAvailable(
          entry.faculty,
          slot.day,
          slot.period,
          facultySchedule
        );
      })
      .map((slot) => ({
        slot,
        score: getCandidateSlotScore({
          slot,
          timetable,
          dayLoads,
          days,
          periodsPerDay,
          subjectDayAssignments,
          freePeriodDistribution,
          subjectName: entry.subject,
        }),
      }))
      .sort((a, b) => a.score - b.score);

    const bestCandidate = candidates[0];

    if (!bestCandidate) {
      return;
    }

    timetable[bestCandidate.slot.day][bestCandidate.slot.period] = entry;
    dayLoads[bestCandidate.slot.day] += 1;
    facultySchedule[entry.faculty][
      `${bestCandidate.slot.day}-${bestCandidate.slot.period}`
    ] = section;
    subjectDayAssignments[entry.subject].push(days.indexOf(bestCandidate.slot.day));
  });

  if (!allowFreePeriods) {
    return timetable;
  }

  if (freePeriodDistribution === "end") {
    Object.keys(timetable).forEach((day) => {
      const scheduled = timetable[day].filter(Boolean);
      const freeCount = periodsPerDay - scheduled.length;
      timetable[day] = [...scheduled, ...Array(freeCount).fill(null)].slice(
        0,
        periodsPerDay
      );
    });
  }

  return timetable;
}

function generateSchedule(
  section,
  subjects,
  workingDays,
  periodsPerDay,
  allowFreePeriods,
  freePeriodDistribution,
  facultySchedule,
  smartScheduling
) {
  if (!smartScheduling) {
    return generateScheduleLegacy(
      section,
      subjects,
      workingDays,
      periodsPerDay,
      allowFreePeriods,
      freePeriodDistribution,
      facultySchedule
    );
  }

  return generateScheduleSmart(
    section,
    subjects,
    workingDays,
    periodsPerDay,
    allowFreePeriods,
    freePeriodDistribution,
    facultySchedule
  );
}

function cloneTimetables(timetables) {
  return JSON.parse(JSON.stringify(timetables));
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

    {
      name:"Data Strctures",
      faculty:"Dr Noobday",
      hoursPerWeek:2,
    }
  ];

  const facultyList = ["Dr Rao", "Dr Sharma", "Dr Patel", "Dr Kumar","Dr Noobday"];
  const sectionList = ["CSE-A", "CSE-B", "CSE-C"];

  const [generatedTimetables, setGeneratedTimetables] = useState({});
  const [editingSlot, setEditingSlot] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [workingDays, setWorkingDays] = useState(5);
  const [periodsPerDay, setPeriodsPerDay] = useState(5);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [allowFreePeriods, setAllowFreePeriods] = useState(true);
  const [freePeriodDistribution, setFreePeriodDistribution] = useState("balanced");
  const [smartScheduling, setSmartScheduling] = useState(true);
  const [swapMode, setSwapMode] = useState(false);
  const [conflictMessage, setConflictMessage] = useState("");
  const [generationConflictMessage, setGenerationConflictMessage] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(facultyList);
  const [selectedSections, setSelectedSections] = useState(sectionList);
  const [savedTimetables, setSavedTimetables] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem(SAVED_TIMETABLES_KEY);

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [showSavedTimetablesModal, setShowSavedTimetablesModal] = useState(false);
  const [savedTimetablesModalMode, setSavedTimetablesModalMode] = useState("load");

  const hasGeneratedTimetables = Object.keys(generatedTimetables).length > 0;

  useEffect(() => {
    window.localStorage.setItem(
      SAVED_TIMETABLES_KEY,
      JSON.stringify(savedTimetables)
    );
  }, [savedTimetables]);

  const checkFacultyConflict = (
    facultyName,
    sectionName,
    day,
    periodIndex,
    ignoreCurrentSlot = false
  ) => {
    if (!facultyName || !hasGeneratedTimetables) {
      return false;
    }

    return Object.entries(generatedTimetables).some(([sectionKey, timetable]) => {
      const slot = timetable?.[day]?.[periodIndex];

      if (!slot || slot === "Free" || slot.faculty !== facultyName) {
        return false;
      }

      if (
        ignoreCurrentSlot &&
        sectionKey === sectionName &&
        editingSlot &&
        editingSlot.day === day &&
        editingSlot.periodIndex === periodIndex
      ) {
        return false;
      }

      return true;
    });
  };

  const saveVersionSnapshot = (timetables) => {
    const snapshot = cloneTimetables(timetables);
    const newVersion = {
      id: Date.now(),
      name: `Version ${versions.length + 1}`,
      timetables: snapshot,
    };

    setVersions((prev) => [...prev, newVersion]);
    setCurrentVersion(newVersion.id);
  };

  const updateTimetablesWithValidation = (nextTimetables) => {
    setGeneratedTimetables(nextTimetables);

    const conflicts = validateFacultyConflicts(nextTimetables);
    if (conflicts.length === 0) {
      setGenerationConflictMessage("");
      return;
    }

    const message = conflicts
      .map((assignments) => {
        const { faculty } = assignments[0];
        const lines = assignments.map(
          ({ section, day, periodIndex }) =>
            `${section} ${day} P${periodIndex + 1}`
        );

        return `⚠ Faculty Conflict Detected\n${faculty} assigned to:\n${lines.join(
          "\n"
        )}`;
      })
      .join("\n\n");

    setGenerationConflictMessage(message);
  };

  const handleGenerate = () => {
    const filteredSubjects = subjects.filter((subject) =>
      selectedFaculty.includes(subject.faculty)
    );

    const nextTimetables = {};
    const facultySchedule = createFacultySchedule(selectedFaculty);

    selectedSections.forEach((section) => {
      nextTimetables[section] = generateSchedule(
        section,
        filteredSubjects,
        workingDays,
        periodsPerDay,
        allowFreePeriods,
        freePeriodDistribution,
        facultySchedule,
        smartScheduling
      );
    });

    updateTimetablesWithValidation(nextTimetables);
    setEditingSlot(null);
    setSelectedSlot(null);
    setSwapMode(false);
    setConflictMessage("");
    saveVersionSnapshot(nextTimetables);
  };

  const handleSwapCellClick = (section, day, periodIndex) => {
    if (!swapMode) {
      return;
    }

    if (
      selectedSlot &&
      selectedSlot.section === section &&
      selectedSlot.day === day &&
      selectedSlot.periodIndex === periodIndex
    ) {
      setSelectedSlot(null);
      return;
    }

    if (!selectedSlot) {
      setSelectedSlot({ section, day, periodIndex });
      return;
    }

    if (selectedSlot.section !== section) {
      setSelectedSlot({ section, day, periodIndex });
      return;
    }

    const updatedTimetables = cloneTimetables(generatedTimetables);
    const temp =
      updatedTimetables[section][selectedSlot.day][selectedSlot.periodIndex];

    updatedTimetables[section][selectedSlot.day][selectedSlot.periodIndex] =
      updatedTimetables[section][day][periodIndex];
    updatedTimetables[section][day][periodIndex] = temp;

    updateTimetablesWithValidation(updatedTimetables);
    setSelectedSlot(null);
  };

  const handleEditCellClick = (section, day, periodIndex, period) => {
    setEditingSlot({
      section,
      day,
      periodIndex,
      currentSubject: period,
    });
    setSelectedSubject(period?.subject ?? "Free");
    setConflictMessage("");
  };

  const handleSaveEdit = () => {
    if (!editingSlot) {
      return;
    }

    if (selectedSubject !== "Free") {
      const selected = subjects.find((subject) => subject.name === selectedSubject);

      if (
        selected &&
        checkFacultyConflict(
          selected.faculty,
          editingSlot.section,
          editingSlot.day,
          editingSlot.periodIndex,
          true
        )
      ) {
        setConflictMessage(
          `${selected.faculty} is already assigned to another section during this period.`
        );
        return;
      }
    }

    const updatedTimetables = cloneTimetables(generatedTimetables);

    if (selectedSubject === "Free") {
      updatedTimetables[editingSlot.section][editingSlot.day][
        editingSlot.periodIndex
      ] = null;
    } else {
      const selected = subjects.find((subject) => subject.name === selectedSubject);
      updatedTimetables[editingSlot.section][editingSlot.day][
        editingSlot.periodIndex
      ] = {
        subject: selected.name,
        faculty: selected.faculty,
      };
    }

    updateTimetablesWithValidation(updatedTimetables);
    setEditingSlot(null);
    setConflictMessage("");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    Object.entries(generatedTimetables).forEach(([section, timetable], sectionIndex) => {
      if (sectionIndex > 0) {
        doc.addPage();
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Slotify - Timetable Report", 40, 40);

      doc.setFontSize(13);
      doc.text(`Section: ${section}`, 40, 66);

      const headers = [
        "Day",
        ...Array.from({ length: periodsPerDay }, (_, index) => `P${index + 1}`),
      ];

      const body = Object.entries(timetable).map(([day, periods]) => [
        day,
        ...periods.map((period) =>
          period === null || period === "Free"
            ? "Free"
            : `${period.subject}\n${period.faculty}`
        ),
      ]);

      autoTable(doc, {
        head: [headers],
        body,
        startY: 86,
        theme: "grid",
        styles: {
          font: "helvetica",
          fontSize: 10,
          cellPadding: 8,
          valign: "middle",
        },
        headStyles: {
          fillColor: [255, 4, 54],
          textColor: 255,
          fontStyle: "bold",
        },
        bodyStyles: {
          textColor: 40,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 90,
          },
        },
        margin: {
          top: 86,
          left: 40,
          right: 40,
          bottom: 40,
        },
      });
    });

    const today = new Date().toISOString().split("T")[0];
    doc.save(`slotify-timetable-${today}.pdf`);
  };

  const handleSaveTimetable = () => {
    if (!hasGeneratedTimetables) {
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const savedTimetable = {
      id: Date.now(),
      name: `Timetable ${currentDate}`,
      timetables: cloneTimetables(generatedTimetables),
      createdAt: new Date().toISOString(),
    };

    setSavedTimetables((prev) => [savedTimetable, ...prev]);
  };

  const handleLoadSavedTimetable = (savedTimetable) => {
    const nextTimetables = cloneTimetables(savedTimetable.timetables);

    updateTimetablesWithValidation(nextTimetables);
    setEditingSlot(null);
    setSelectedSlot(null);
    setSwapMode(false);
    setConflictMessage("");
    saveVersionSnapshot(nextTimetables);
    setShowSavedTimetablesModal(false);
  };

  const handleDeleteSavedTimetable = (savedTimetableId) => {
    setSavedTimetables((prev) =>
      prev.filter((savedTimetable) => savedTimetable.id !== savedTimetableId)
    );
  };

  const openSavedTimetablesModal = (mode) => {
    setSavedTimetablesModalMode(mode);
    setShowSavedTimetablesModal(true);
  };

  return (
    <div className="w-full overflow-auto">
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <h1 className="mb-2 text-3xl font-bold text-black sm:text-4xl">
          Timetable Generator
        </h1>

        <p className="mb-8 text-sm font-medium text-zinc-900 sm:text-base">
          Generate smart academic timetables.
        </p>

        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-black sm:text-2xl">
            Generator Settings
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-zinc-900">
                Working Days
              </label>

              <input
                type="number"
                value={workingDays}
                onChange={(event) => setWorkingDays(Number(event.target.value))}
                className="w-full rounded-xl border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-zinc-900">
                Periods Per Day
              </label>

              <input
                type="number"
                value={periodsPerDay}
                onChange={(event) => setPeriodsPerDay(Number(event.target.value))}
                className="w-full rounded-xl border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={smartScheduling}
                onChange={(event) => setSmartScheduling(event.target.checked)}
                className="h-4 w-4 rounded"
              />

              <span className="font-medium text-zinc-900">Smart Scheduling</span>
            </label>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={allowFreePeriods}
                onChange={(event) => setAllowFreePeriods(event.target.checked)}
                className="h-4 w-4 rounded"
              />

              <span className="font-medium text-zinc-900">Allow Free Periods</span>
            </label>

            {allowFreePeriods && (
              <div className="mt-6">
                <label className="mb-3 block font-medium text-zinc-900">
                  Free Period Distribution
                </label>

                <select
                  value={freePeriodDistribution}
                  onChange={(event) =>
                    setFreePeriodDistribution(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-[#FF0436]"
                >
                  <option value="balanced">Balanced</option>
                  <option value="end">End of Day</option>
                  <option value="random">Random</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-3 block font-medium text-zinc-900">
              Faculty Selection
            </label>

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedFaculty(facultyList)}
                className="rounded-lg bg-gray-100 px-3 py-2"
              >
                Select All
              </button>

              <button
                type="button"
                onClick={() => setSelectedFaculty([])}
                className="rounded-lg bg-gray-100 px-3 py-2"
              >
                Clear All
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2">
              {facultyList.map((faculty) => (
                <label key={faculty} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedFaculty.includes(faculty)}
                    onChange={() => {
                      if (selectedFaculty.includes(faculty)) {
                        setSelectedFaculty(
                          selectedFaculty.filter((item) => item !== faculty)
                        );
                        return;
                      }

                      setSelectedFaculty([...selectedFaculty, faculty]);
                    }}
                  />

                  {faculty}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-3 block font-medium text-zinc-900">
              Section Selection
            </label>

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSections(sectionList)}
                className="rounded-lg bg-gray-100 px-3 py-2"
              >
                Select All
              </button>

              <button
                type="button"
                onClick={() => setSelectedSections([])}
                className="rounded-lg bg-gray-100 px-3 py-2"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sectionList.map((section) => (
                <label key={section} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={() => {
                      if (selectedSections.includes(section)) {
                        setSelectedSections(
                          selectedSections.filter((item) => item !== section)
                        );
                        return;
                      }

                      setSelectedSections([...selectedSections, section]);
                    }}
                  />

                  {section}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
          >
            Generate Timetable
          </button>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-zinc-700">
              Saved Timetables: {savedTimetables.length}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSaveTimetable}
                disabled={!hasGeneratedTimetables}
                className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Save Timetable
              </button>

              <button
                onClick={() => openSavedTimetablesModal("load")}
                className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-zinc-900 transition-all hover:bg-gray-200"
              >
                Load Timetable
              </button>

              <button
                onClick={() => openSavedTimetablesModal("delete")}
                className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-[#FF0436] transition-all hover:bg-red-100"
              >
                Delete Timetable
              </button>
            </div>
          </div>
        </div>

        {hasGeneratedTimetables && (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {generationConflictMessage && (
              <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
                <p className="whitespace-pre-line text-sm font-medium text-amber-800">
                  {generationConflictMessage}
                </p>
              </div>
            )}

            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-xl font-semibold text-black sm:text-2xl">
                Generated Timetables
              </h2>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSwapMode(!swapMode);
                    setSelectedSlot(null);
                  }}
                  className={`rounded-xl px-4 py-2 font-semibold transition-all ${
                    swapMode
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-zinc-900 hover:bg-gray-200"
                  }`}
                >
                  {swapMode ? "Swap Mode ON" : "Swap Mode OFF"}
                </button>

                <button
                  onClick={handleGenerate}
                  className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-[#FF0436] transition-all hover:bg-red-100"
                >
                  Regenerate
                </button>

                <button
                  onClick={handleExportPDF}
                  className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition-all hover:bg-black"
                >
                  Export PDF
                </button>

                <button
                  onClick={handleSaveTimetable}
                  className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition-all hover:bg-black"
                >
                  Save Timetable
                </button>

                <button
                  onClick={() => openSavedTimetablesModal("load")}
                  className="rounded-xl bg-gray-100 px-4 py-2 font-semibold text-zinc-900 transition-all hover:bg-gray-200"
                >
                  Load Timetable
                </button>

                <button
                  onClick={() => openSavedTimetablesModal("delete")}
                  className="rounded-xl bg-red-50 px-4 py-2 font-semibold text-[#FF0436] transition-all hover:bg-red-100"
                >
                  Delete Timetable
                </button>
              </div>
            </div>

            <p className="mb-6 text-sm font-medium text-zinc-700">
              Saved Timetables: {savedTimetables.length}
            </p>

            {versions.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-black">
                  Timetable Versions
                </h3>

                <div className="flex flex-wrap gap-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => {
                        updateTimetablesWithValidation(
                          cloneTimetables(version.timetables)
                        );
                        setCurrentVersion(version.id);
                        setSelectedSlot(null);
                        setSwapMode(false);
                        setEditingSlot(null);
                        setConflictMessage("");
                      }}
                      className={`rounded-xl px-4 py-2 font-medium transition-all ${
                        currentVersion === version.id
                          ? "bg-[#FF0436] text-white"
                          : "bg-gray-100 text-zinc-900 hover:bg-gray-200"
                      }`}
                    >
                      {version.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-10">
              {Object.entries(generatedTimetables).map(([section, timetable]) => (
                <div key={section}>
                  <h3 className="mb-4 text-lg font-semibold text-black sm:text-xl">
                    {section} Timetable
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="p-3 text-left font-semibold text-black">
                            Day
                          </th>

                          {Array.from({ length: periodsPerDay }, (_, index) => (
                            <th
                              key={index}
                              className="p-3 text-center font-semibold text-black"
                            >
                              P{index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {Object.entries(timetable).map(([day, periods]) => (
                          <tr
                            key={`${section}-${day}`}
                            className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                          >
                            <td className="p-3 font-semibold text-zinc-900">
                              {day}
                            </td>

                            {periods.map((period, periodIndex) => {
                              const isSelectedSwapCell =
                                selectedSlot &&
                                selectedSlot.section === section &&
                                selectedSlot.day === day &&
                                selectedSlot.periodIndex === periodIndex;

                              return (
                                <td
                                  key={`${section}-${day}-${periodIndex}`}
                                  className={`cursor-pointer p-3 text-center transition ${
                                    swapMode
                                      ? isSelectedSwapCell
                                        ? "bg-pink-200"
                                        : "hover:bg-pink-50"
                                      : "hover:bg-pink-50"
                                  }`}
                                  onClick={() => {
                                    if (swapMode) {
                                      handleSwapCellClick(section, day, periodIndex);
                                      return;
                                    }

                                    handleEditCellClick(section, day, periodIndex, period);
                                  }}
                                >
                                  {period === null || period === "Free" ? (
                                    <span>Free</span>
                                  ) : (
                                    <div>
                                      <div className="font-medium text-black">
                                        {period.subject}
                                      </div>
                                      <div className="text-xs font-medium text-zinc-900">
                                        {period.faculty}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editingSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-3xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Edit Timetable Slot
            </h2>

            <p className="mb-2 font-medium text-zinc-900">{editingSlot.section}</p>
            <p className="mb-4 font-medium text-zinc-900">
              {editingSlot.day} - P{editingSlot.periodIndex + 1}
            </p>

            {conflictMessage && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Warning: Faculty Conflict Detected
                </p>
                <p className="mt-1 text-sm text-red-700">{conflictMessage}</p>
              </div>
            )}

            <select
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="Free">Free Period</option>

              {subjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingSlot(null);
                  setConflictMessage("");
                }}
                className="rounded-xl border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showSavedTimetablesModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {savedTimetablesModalMode === "load"
                    ? "Load Timetable"
                    : "Delete Timetable"}
                </h2>
                <p className="mt-2 text-sm font-medium text-zinc-900">
                  Saved Timetables: {savedTimetables.length}
                </p>
              </div>

              <button
                onClick={() => setShowSavedTimetablesModal(false)}
                className="rounded-xl border px-4 py-2"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {savedTimetables.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center font-medium text-zinc-900">
                  No saved timetables found.
                </div>
              ) : (
                savedTimetables.map((savedTimetable, index) => (
                  <button
                    key={savedTimetable.id}
                    onClick={() => {
                      if (savedTimetablesModalMode === "load") {
                        handleLoadSavedTimetable(savedTimetable);
                        return;
                      }

                      handleDeleteSavedTimetable(savedTimetable.id);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      savedTimetablesModalMode === "load"
                        ? "border-gray-200 hover:border-[#FF0436] hover:bg-red-50"
                        : "border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      Timetable {index + 1}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {savedTimetable.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-zinc-900">
                      {new Date(savedTimetable.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableGenerator;
