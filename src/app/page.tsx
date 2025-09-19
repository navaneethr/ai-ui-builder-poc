"use client";

import { useState, useEffect } from "react";
import MainContent from "@/components/MainContent";
import ChatSection from "@/components/ChatSection";

export interface CachedComponent {
  id: string;
  component: string;
  prompt: string;
  props: any;
  timestamp: number;
}

const STORAGE_KEY = "generated-components";

export default function Home() {
  const [componentData, setComponentData] = useState<CachedComponent[]>([]);

  // Load components from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    console.log("Main page loading from localStorage:", saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("Main page parsed componentData:", parsed);
        setComponentData(parsed);
      } catch (error) {
        console.error("Failed to parse saved components:", error);
      }
    } else {
      console.log("No saved components found in localStorage");
    }
  }, []);

  // Listen for storage changes to sync component data
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setComponentData(parsed);
        } catch (error) {
          console.error("Failed to parse saved components:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      {/* <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div> */}

      {/* Main Content */}
      <div className="flex-1">
        <MainContent />
      </div>

      {/* Chat Section */}
      <div className="w-[500px] flex-shrink-0">
        <ChatSection />
      </div>
    </div>
  );
}
