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
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Policy Analysis</h1>
              <p className="text-neutral-600">Analyze and understand your insurance policies with AI-powered insights</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: 2 minutes ago</span>
              </div>
              
              <Button
                onClick={handleExportReport}
                className="bg-primary-100 text-primary-700 hover:bg-primary-200 px-4 py-2 rounded-lg transition-colors"
                variant="ghost"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-4xl mx-auto p-8">
            <SearchSection onSearchResults={handleSearchResults} />
            <QuickActions />
            <RecentPolicies />
          </div>
        </main>
      </div>
    </div>
  );
}
