import ComponentGenerator from "./ComponentGenerator";

export default function MainContent() {
  return (
    <div className="h-screen bg-white dark:bg-slate-800 p-6 overflow-y-auto">
      <div className="space-y-8">
        <ComponentGenerator />
      </div>
    </div>
  );
}
