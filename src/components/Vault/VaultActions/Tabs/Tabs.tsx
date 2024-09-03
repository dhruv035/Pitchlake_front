import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex mb-4 border-b border-gray-700">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`px-4 py-2 relative ${
          activeTab === tab ? "text-[#F5EBB8]" : "text-gray-400"
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
        {activeTab === tab && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5EBB8]"></div>
        )}
      </button>
    ))}
  </div>
);

export default Tabs;