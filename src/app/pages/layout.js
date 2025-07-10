"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function PagesLayout({ children }) {
  const [isCollapsed, setCollapsed] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isCollapsed={isCollapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </LocalizationProvider>
  );
}
