import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

        <footer className="py-4 text-center text-sm text-gray-500 border-t bg-white shadow-inner">
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/dibya-chowdhury-355967322"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Dibya Chowdhury
          </a>{" "}
          <span className="ml-2 text-xs text-gray-400">
  • Powered by GPT-4o-mini
</span>
        </footer>
      </div>
    </div>
  );
};

export default Layout;