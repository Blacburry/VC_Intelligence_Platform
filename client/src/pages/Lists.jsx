import { useEffect, useState } from "react";

const Lists = () => {
  const [lists, setLists] = useState({});

  const [newListName, setNewListName] = useState("");

  const [listMessage, setListMessage] = useState("");

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("lists")) || {};
    setLists(stored);
  }, []);

  const removeCompany = (listName, companyId) => {
    const updated = { ...lists };

    updated[listName] = updated[listName].filter(
      (c) => c.id !== companyId
    );

    localStorage.setItem("lists", JSON.stringify(updated));
    setLists(updated);
  };

  const exportJSON = (listName) => {
    const dataStr = JSON.stringify(lists[listName], null, 2);
    const blob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${listName}.json`;
    a.click();
  };

  const exportCSV = (listName) => {
    const companies = lists[listName];

    const header =
      "Name,Sector,Stage,Location,Website\n";

    const rows = companies
      .map(
        (c) =>
          `${c.name},${c.sector},${c.stage},${c.location},${c.website}`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${listName}.csv`;
    a.click();
  };

  const createList = () => {
  if (!newListName.trim()) return;

  if (lists[newListName]) {
  setListMessage("List already exists.");
  setTimeout(() => setListMessage(""), 2000);
  return;
}

  const updated = {
    ...lists,
    [newListName]: [],
  };

  localStorage.setItem("lists", JSON.stringify(updated));
  setLists(updated);
  setNewListName("");
};

  return (
  <div>
    <h2 className="text-2xl font-semibold mb-6">
      Lists
    </h2>

    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="New list name..."
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      />

      <button
        onClick={createList}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Create List
      </button>
    </div>

    {listMessage && (
      <p className="text-red-600 text-sm mb-4">
        {listMessage}
      </p>
    )}

    {Object.keys(lists).length === 0 && (
      <p>No lists created yet.</p>
    )}

    {Object.entries(lists).map(
      ([listName, companies]) => (
        <div
          key={listName}
          className="bg-white rounded-xl shadow p-6 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">
            {listName} ({companies.length})
          </h3>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => exportJSON(listName)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Export JSON
            </button>

            <button
              onClick={() => exportCSV(listName)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Export CSV
            </button>
          </div>

          <ul className="space-y-3">
            {companies.map((company) => (
              <li
                key={company.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {company.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {company.sector} • {company.stage}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeCompany(
                      listName,
                      company.id
                    )
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
    )}
  </div>
);
};

export default Lists;