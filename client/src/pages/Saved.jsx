import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("savedSearches")) || [];
    setSavedSearches(stored);
  }, []);

  const deleteSearch = (id) => {
    const updated = savedSearches.filter(
      (s) => s.id !== id
    );
    localStorage.setItem(
      "savedSearches",
      JSON.stringify(updated)
    );
    setSavedSearches(updated);
  };

  const runSearch = (searchObj) => {
    const params = new URLSearchParams({
      search: searchObj.search || "",
      sector: searchObj.sector || "",
      stage: searchObj.stage || "",
    });

    navigate(`/?${params.toString()}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Saved Searches
      </h2>

      {savedSearches.length === 0 && (
        <p>No saved searches yet.</p>
      )}

      <div className="space-y-4">
        {savedSearches.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                Search: {s.search || "Any"}
              </p>
              <p className="text-sm text-gray-500">
                Sector: {s.sector || "Any"} • Stage:{" "}
                {s.stage || "Any"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => runSearch(s)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Run
              </button>

              <button
                onClick={() => deleteSearch(s.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Saved;