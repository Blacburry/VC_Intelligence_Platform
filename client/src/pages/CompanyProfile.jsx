import { useParams } from "react-router-dom";
import companiesData from "../data/companies.json";
import axios from "axios";
import { useState, useEffect } from "react";

const CompanyProfile = () => {
  const { id } = useParams();

  const company = companiesData.find((c) => c.id == id);

  const [enrichment, setEnrichment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableLists, setAvailableLists] = useState([]);
const [selectedList, setSelectedList] = useState("");
const [saveMessage, setSaveMessage] = useState("");

  // ✅ Notes state
  const [note, setNote] = useState("");

  // ✅ Load saved note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem(`note-${id}`);
    if (savedNote) {
      setNote(savedNote);
    }
  }, [id]);

  const handleSaveNote = () => {
    localStorage.setItem(`note-${id}`, note);
  };

  useEffect(() => {
  const stored =
    JSON.parse(localStorage.getItem("lists")) || {};

  const keys = Object.keys(stored);
  setAvailableLists(keys);

  if (keys.length > 0) {
    setSelectedList(keys[0]);
  }
}, []);

  const handleEnrich = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/enrich",
        {
          url: company.website,
        }
      );

      setEnrichment(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!company) {
    return <div>Company not found</div>;
  }

  const handleSaveToList = (listName) => {
  const existingLists =
    JSON.parse(localStorage.getItem("lists")) || {};

  if (!existingLists[listName]) {
    existingLists[listName] = [];
  }

  const alreadyExists = existingLists[listName].some(
    (c) => c.id == company.id
  );

  if (!alreadyExists) {
    existingLists[listName].push(company);
  }

  localStorage.setItem(
    "lists",
    JSON.stringify(existingLists)
  );

  setSaveMessage("Added to list successfully!");

setTimeout(() => {
  setSaveMessage("");
}, 2000);
};

const isAlreadyInList = () => {
  const stored =
    JSON.parse(localStorage.getItem("lists")) || {};

  return (
    stored[selectedList]?.some(
      (c) => c.id == company.id
    ) || false
  );
};
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">
        {company.name}
      </h2>

      <p className="text-gray-600 mb-6">
        {company.sector} • {company.stage} • {company.location}
      </p>

      {/* Website */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium mb-2">
          Website
        </h3>
        <a
          href={company.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {company.website}
        </a>
      </div>

      {/* Enrichment */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          Enrichment
        </h3>

        {!enrichment && (
          <button
            onClick={handleEnrich}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Enriching..." : "Enrich"}
          </button>
        )}

        {enrichment && (
          <div>
            <div
  className={`mb-4 p-4 rounded-lg ${
    enrichment.investmentScore >= 8
      ? "bg-green-50 border border-green-200"
      : enrichment.investmentScore >= 5
      ? "bg-yellow-50 border border-yellow-200"
      : "bg-red-50 border border-red-200"
  }`}
>
  <p
  className={`text-lg font-semibold ${
    enrichment.investmentScore >= 8
      ? "text-green-700"
      : enrichment.investmentScore >= 5
      ? "text-yellow-700"
      : "text-red-700"
  }`}
>
    Investment Score: {enrichment.investmentScore}/10
  </p>
  <p className="text-sm text-gray-600 mt-1">
    {enrichment.scoreReasoning}
  </p>
</div>
            <p className="mb-4">
              {enrichment.summary}
            </p>

            {/* Bullets */}
            <ul className="list-disc ml-6 mb-4">
              {enrichment.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            {/* Keywords */}
            <p className="mb-4">
              <strong>Keywords:</strong>{" "}
              {enrichment.keywords.join(", ")}
            </p>

            {/* Signals */}
            <h4 className="font-semibold mb-2">
              Investment Signals
            </h4>
            <ul className="list-disc ml-6 mb-4">
              {enrichment.signals.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            {/* Risks */}
{enrichment.risks && enrichment.risks.length > 0 && (
  <div className="mt-4">
    <h4 className="font-semibold mb-2 text-red-600">
      Risks
    </h4>
    <ul className="list-disc ml-6 text-sm">
      {enrichment.risks.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  </div>
)}

            {/* Sources */}
            {enrichment.sources && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">
                  Sources
                </h4>
                {enrichment.sources.map(
                  (source, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 mb-2"
                    >
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {source.url}
                      </a>
                      <div>
                        Scraped at:{" "}
                        {new Date(
                          source.scrapedAt
                        ).toLocaleString()}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
  <h3 className="text-lg font-medium mb-4">
    Save to List
  </h3>

  {availableLists.length === 0 ? (
    <p className="text-gray-500">
      Create a list first from Lists page.
    </p>
  ) : (
    <div className="flex gap-4 items-center">
      <select
        value={selectedList}
        onChange={(e) =>
          setSelectedList(e.target.value)
        }
        className="px-4 py-2 border rounded-lg"
      >
        {availableLists.map((list) => (
          <option key={list} value={list}>
            {list}
          </option>
        ))}
      </select>

      <button
  onClick={() => handleSaveToList(selectedList)}
  disabled={isAlreadyInList()}
  className={`px-4 py-2 rounded-lg text-white ${
    isAlreadyInList()
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600"
  }`}
>
  {isAlreadyInList() ? "Already Added" : "Add"}
</button>
    </div>
  )}
  {saveMessage && (
  <p className="text-green-600 mt-3 text-sm">
    {saveMessage}
  </p>
)}
</div>
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          Notes
        </h3>

        <textarea
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          placeholder="Write investment notes..."
          className="w-full border rounded-lg p-3 min-h-[120px]"
        />

        <button
          onClick={handleSaveNote}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default CompanyProfile;