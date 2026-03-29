/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Result from "./pages/Result";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex h-screen overflow-hidden bg-surface-container">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Scanline effect */}
          <div className="scanline pointer-events-none" />
          
          <TopBar />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/result" element={<Result />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}
