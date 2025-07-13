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
    <div className="animate-slide-in">
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Search className="text-primary-600 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Find Your Policy Document</h2>
          <p className="text-neutral-600 max-w-md mx-auto">
            Enter your policy name, number, or relevant keywords to begin your analysis
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-neutral-400 w-5 h-5" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-neutral-900 placeholder-neutral-500"
              placeholder="Enter your policy name or keywords..."
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Policies
                </>
              )}
            </Button>
          </div>
        </div>

        {hasSearched && searchResults && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-neutral-50 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">
                Search Results ({searchResults.length})
              </h3>
              {searchResults.length === 0 ? (
                <p className="text-neutral-600 text-sm">No policies found matching your search.</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.slice(0, 3).map((policy) => (
                    <div key={policy.id} className="bg-white rounded-md p-3 text-sm">
                      <div className="font-medium text-neutral-900">{policy.policyName}</div>
                      <div className="text-neutral-600">Policy #: {policy.policyNumber}</div>
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
          </div>
        )}
      </div>
    </div>
  );
}
