import { useState } from "react";

function TimetableGenerator() {

  const [generated, setGenerated] = useState(false);

  const timetable = {
    Monday: ["DBMS", "Free", "OS", "CN", "Free"],
    Tuesday: ["OS", "DBMS", "Free", "CN", "Java"],
    Wednesday: ["CN", "Free", "DBMS", "OS", "Free"],
    Thursday: ["Java", "DBMS", "OS", "Free", "CN"],
    Friday: ["DBMS", "CN", "Free", "OS", "Java"],
  };

  const generateTimetable = () => {
    setGenerated(true);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">

      <h1 className="text-4xl font-bold text-black mb-2">
        Timetable Generator
      </h1>

      <p className="text-gray-600 mb-8">
        Configure settings and generate a timetable.
      </p>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">

        <h2 className="text-2xl font-semibold mb-6">
          Generator Settings
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block mb-2 font-medium">
              Working Days
            </label>

            <input
              type="number"
              defaultValue="5"
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Periods Per Day
            </label>

            <input
              type="number"
              defaultValue="5"
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>

        <div className="mt-6">

          <label className="flex items-center gap-3">

            <input type="checkbox" defaultChecked />

            Allow Free Periods

          </label>

        </div>

        <button
          onClick={generateTimetable}
          className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white"
        >
          Generate Timetable
        </button>

      </div>

      {generated && (

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-semibold">
              Generated Timetable
            </h2>

            <button
              onClick={generateTimetable}
              className="px-4 py-2 rounded-xl bg-pink-100 text-[#FF0436]"
            >
              Regenerate
            </button>

          </div>

          <table className="w-full">

            <thead>
              <tr>
                <th className="p-3 text-left">Day</th>
                <th className="p-3">P1</th>
                <th className="p-3">P2</th>
                <th className="p-3">P3</th>
                <th className="p-3">P4</th>
                <th className="p-3">P5</th>
              </tr>
            </thead>

            <tbody>

              {Object.entries(timetable).map(
                ([day, periods]) => (
                  <tr key={day} className="border-t">

                    <td className="p-3 font-semibold">
                      {day}
                    </td>

                    {periods.map((period, index) => (
                      <td
                        key={index}
                        className="p-3 text-center"
                      >
                        {period}
                      </td>
                    ))}

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default TimetableGenerator;