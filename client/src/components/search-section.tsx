import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Policy } from "@shared/schema";

interface SearchSectionProps {
  onSearchResults?: (results: Policy[]) => void;
}

export function SearchSection({ onSearchResults }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['/api/policies/search', searchQuery],
    enabled: false,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    const result = await refetch();
    
    if (result.data && onSearchResults) {
      onSearchResults(result.data);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="animate-slide-in mb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-3">Policy Analysis</h1>
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
          First, let's find your policy document.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-20 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-500 shadow-sm"
            placeholder="Enter your policy name or keywords..."
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-2 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 text-white px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
        
        {hasSearched && searchResults && (
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <p className="text-neutral-600">No policies found matching your search.</p>
            ) : (
              <div className="space-y-3">
                {searchResults.slice(0, 3).map((policy) => (
                  <div key={policy.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                    <div className="font-medium text-neutral-900">{policy.policyName}</div>
                    <div className="text-neutral-600 text-sm">Policy #: {policy.policyNumber}</div>
                  </div>
                ))}
                {searchResults.length > 3 && (
                  <p className="text-neutral-600 text-sm">
                    +{searchResults.length - 3} more results
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
