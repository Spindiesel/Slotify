import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Sections() {
  const { bg, text, border, input } = useTheme();
  const [sectionName, setSectionName] =
    useState("");

  const [sections, setSections] =
    useState([]);

  const addSection = () => {
    if (!sectionName.trim()) return;

    const newSection = {
      id: Date.now(),
      name: sectionName,
    };

    setSections([
      ...sections,
      newSection,
    ]);

    setSectionName("");
  };

  const deleteSection = (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this section?"
      );

    if (!confirmDelete) return;

    setSections(
      sections.filter(
        (section) => section.id !== id
      )
    );
  };

  return (
    <div className={`w-full overflow-auto ${bg.page}`}>
      <div className="w-full p-4 sm:p-6 lg:p-8">

      <h1 className={`mb-2 text-3xl font-bold sm:text-4xl ${text.primary}`}>
        Sections Management
      </h1>

      <p className={`${text.secondary} mb-8 text-sm sm:text-base font-medium`}>
        Manage academic sections.
      </p>

      <div className={`${bg.card} ${border} mb-8 rounded-3xl border p-6 shadow-sm`}>

        <h2 className={`mb-6 text-2xl font-semibold ${text.primary}`}>
          Add Section
        </h2>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Section Name"
            value={sectionName}
            onChange={(e) =>
              setSectionName(e.target.value)
            }
            className={`flex-1 rounded-xl border p-3 ${input}`}
          />

          <button
            onClick={addSection}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-semibold"
          >
            Add Section
          </button>

        </div>

      </div>

      <div className={`${bg.card} ${border} rounded-3xl border p-6 shadow-sm`}>

        <h2 className={`mb-6 text-2xl font-semibold ${text.primary}`}>
          Sections
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left font-semibold text-black">
                Section
              </th>

              <th className="p-3 text-right font-semibold text-black">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {sections.map((section) => (

              <tr
                key={section.id}
                className="border-b"
              >

                <td className="p-3 font-medium text-zinc-900">
                  {section.name}
                </td>

                <td className="p-3 text-right">

                  <button
                    onClick={() =>
                      deleteSection(
                        section.id
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-red-100 text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      </div>
    </div>
  );
}

export default Sections;
