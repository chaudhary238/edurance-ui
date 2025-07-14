import { Policy } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchResultsDisplayProps {
  results: Policy[];
  onPolicySelect: (policy: Policy) => void;
}

export function SearchResultsDisplay({ results, onPolicySelect }: SearchResultsDisplayProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Search Results</h2>
        {results.length === 0 ? (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-neutral-800">No Policies Found</h3>
                <p className="text-neutral-500 mt-1">Your search did not match any policy documents. Please try different keywords.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {results.map((policy) => (
                    <Card key={policy.id} onClick={() => onPolicySelect(policy)} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-lg">{policy.policyName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{policy.insurerName}</p>
                            <p className="text-sm mt-2">{policy.full_summary}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </div>
  );
} 