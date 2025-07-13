import { useState } from "react";
import { Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { SearchSection } from "@/components/search-section";
import { QuickActions } from "@/components/quick-actions";
import { RecentPolicies } from "@/components/recent-policies";
import { Policy } from "@shared/schema";

export default function Dashboard() {
  const [searchResults, setSearchResults] = useState<Policy[]>([]);

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log("Export report");
  };

  const handleSearchResults = (results: Policy[]) => {
    setSearchResults(results);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-5xl mx-auto p-8">
            <SearchSection onSearchResults={handleSearchResults} />
            <QuickActions />
            <RecentPolicies />
          </div>
        </main>
      </div>
    </div>
  );
}
