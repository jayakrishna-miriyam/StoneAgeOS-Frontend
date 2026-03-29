/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Result from "./pages/Result";
import History from "./pages/History";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="flex h-screen overflow-hidden bg-sandstone">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <TopBar />
          
          <main id="main-content" className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide relative z-10">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/result" element={<Result />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/history" element={<History />} />
              </Routes>

              <footer className="mt-16 border-t border-outline-variant pt-6 pb-8">
                <div className="flex flex-col gap-4 md:gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-on-surface-variant text-center md:text-left space-y-1">
                    <p>© {new Date().getFullYear()} StoneAgeOS. All rights reserved.</p>
                    <p>
                      Built by{" "}
                      <a
                        href="https://github.com/jayakrishna-miriyam"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline"
                      >
                        Jaya Krishna Miriyam
                      </a>
                    </p>
                  </div>
                  <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                    <Link to="/" className="chip chip-muted">Home</Link>
                    <Link to="/planner" className="chip chip-muted">Planner</Link>
                    <Link to="/history" className="chip chip-muted">History</Link>
                  </nav>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
