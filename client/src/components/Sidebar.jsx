import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white border-r p-6">
      <h1 className="text-xl font-bold mb-8">
        VC Intelligence
      </h1>

      <nav className="space-y-2">
        <Link to="/" className={linkClass("/")}>
          Companies
        </Link>
        <Link to="/lists" className={linkClass("/lists")}>
          Lists
        </Link>
        <Link to="/saved" className={linkClass("/saved")}>
          Saved Searches
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;