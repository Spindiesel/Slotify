import { useState } from "react";

function Sections() {
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
    <div className="flex-1 bg-gray-50 p-8">

      <h1 className="text-4xl font-bold text-black mb-2">
        Sections Management
      </h1>

      <p className="text-gray-600 mb-8">
        Manage academic sections.
      </p>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
            className="flex-1 border border-gray-300 rounded-xl p-3"
          />

          <button
            onClick={addSection}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF4E6B] to-[#FF0436] text-white font-semibold"
          >
            Add Section
          </button>

        </div>

      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Sections
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3 font-semibold text-gray-900">
                Section
              </th>

              <th className="text-right p-3 font-semibold text-gray-900">
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

                <td className="p-3 text-gray-900 font-medium">
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
  );
}

export default Sections;