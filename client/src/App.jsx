import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Companies from "./pages/Companies";
import Lists from "./pages/Lists";
import Saved from "./pages/Saved";
import CompanyProfile from "./pages/CompanyProfile";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;