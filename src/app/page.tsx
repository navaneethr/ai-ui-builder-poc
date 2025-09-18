import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import ChatSection from "@/components/ChatSection";

export default function Home() {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

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
