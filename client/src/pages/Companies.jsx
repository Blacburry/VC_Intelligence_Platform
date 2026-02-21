import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import companiesData from "../data/companies.json";

const Companies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(location.search);

  setSearch(params.get("search") || "");
  setSector(params.get("sector") || "");
  setStage(params.get("stage") || "");
}, [location.search]);

  const pageSize = 6;

  const uniqueStages = [
  ...new Set(companiesData.map((c) => c.stage))
];

const uniqueSectors = [
  ...new Set(companiesData.map((c) => c.sector))
];

  const filtered = companiesData.filter((company) => {
    return (
      company.name.toLowerCase().includes(search.toLowerCase()) &&
      (sector ? company.sector === sector : true) &&
      (stage ? company.stage === stage : true)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
  if (!sortField) return 0;

  const valueA = a[sortField]?.toLowerCase?.() || "";
  const valueB = b[sortField]?.toLowerCase?.() || "";

  if (valueA < valueB)
    return sortDirection === "asc" ? -1 : 1;
  if (valueA > valueB)
    return sortDirection === "asc" ? 1 : -1;

  return 0;
});

  const paginated = sorted.slice(
  page * pageSize,
  (page + 1) * pageSize
);

  const handleSaveSearch = () => {
  const existing =
    JSON.parse(localStorage.getItem("savedSearches")) || [];

  const newSearch = {
    id: Date.now(),
    search,
    sector,
    stage,
  };

  localStorage.setItem(
    "savedSearches",
    JSON.stringify([...existing, newSearch])
  );

  setSearchMessage("Search saved successfully!");

setTimeout(() => {
  setSearchMessage("");
}, 2000);
};

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Companies
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          className="px-4 py-2 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
  value={sector}
  onChange={(e) => setSector(e.target.value)}
  className="px-4 py-2 border rounded-lg"
>
  <option value="">All Sectors</option>

  {uniqueSectors.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>

        <select
  value={stage}
  onChange={(e) => setStage(e.target.value)}
  className="px-4 py-2 border rounded-lg"
>
  <option value="">All Stages</option>

  {uniqueStages.map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ))}
</select>
        <button
  onClick={handleSaveSearch}
  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
>
  Save Search
</button>
{searchMessage && (
  <p className="text-purple-600 text-sm mt-2">
    {searchMessage}
  </p>
)}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
  <tr>
    <th
  className="p-4 cursor-pointer"
  onClick={() => {
    setSortField("name");
    setSortDirection(
      sortField === "name" && sortDirection === "asc"
        ? "desc"
        : "asc"
    );
  }}
>
  Name
</th>

<th
  className="p-4 cursor-pointer"
  onClick={() => {
    setSortField("sector");
    setSortDirection(
      sortField === "sector" && sortDirection === "asc"
        ? "desc"
        : "asc"
    );
  }}
>
  Sector
</th>

<th
  className="p-4 cursor-pointer"
  onClick={() => {
    setSortField("stage");
    setSortDirection(
      sortField === "stage" && sortDirection === "asc"
        ? "desc"
        : "asc"
    );
  }}
>
  Stage
</th>
    <th className="p-4">Location</th>
  </tr>
</thead>
          <tbody>
            {paginated.map((company) => (
  <tr
    key={company.id}
    onClick={() => navigate(`/companies/${company.id}`)}
    className="border-t hover:bg-gray-50 cursor-pointer"
  >
    <td className="p-4 font-medium">
      {company.name}
    </td>
    <td className="p-4">{company.sector}</td>
    <td className="p-4">{company.stage}</td>
    <td className="p-4">{company.location}</td>
  </tr>
))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() =>
            setPage((prev) => Math.max(prev - 1, 0))
          }
          className="px-4 py-2 border rounded-lg"
        >
          Prev
        </button>

        <button
          onClick={() =>
            (page + 1) * pageSize < filtered.length &&
            setPage(page + 1)
          }
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Companies;