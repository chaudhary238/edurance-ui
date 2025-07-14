import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";

interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  example: string;
}

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlossary = async (query: string = '') => {
      try {
        setLoading(true);
        const url = query ? `/api/glossary?q=${encodeURIComponent(query)}` : '/api/glossary';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch glossary data. Please make sure the backend server is running.');
        }
        const data: GlossaryTerm[] = await response.json();
        setGlossary(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setGlossary([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm === '') {
      fetchGlossary();
    } else {
      const handler = setTimeout(() => {
        fetchGlossary(searchTerm);
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [searchTerm]);

  const handleTermClick = (term: string) => {
    setActiveTerm(activeTerm === term ? null : term);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Jargon Buster & Glossary</h1>
              <p className="text-neutral-600 text-lg">
                Search our glossary or click a term below to get a simple explanation.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search for a term (e.g., Deductible)"
                />
              </div>
            </div>

            {loading ? (
              <p className="text-center text-neutral-500">Loading terms...</p>
            ) : (
              <div className="space-y-4">
                {glossary.map((term) => (
                  <Card key={term.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => handleTermClick(term.term)}
                        className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-primary-600">{term.term}</h3>
                        <ChevronDown className={`w-5 h-5 text-neutral-400 transform transition-transform ${activeTerm === term.term ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {activeTerm === term.term && (
                        <div className="px-6 pb-6 border-t border-neutral-200 bg-neutral-50">
                          <div className="pt-4 space-y-3">
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">What it means:</h4>
                                <p className="text-neutral-700">{term.definition}</p>
                            </div>
                            {term.example && (
                              <div>
                                <h4 className="font-semibold text-neutral-900 mb-1">Real-world example:</h4>
                                <p className="text-neutral-600 italic">{term.example}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {!loading && glossary.length === 0 && !error && (
                  <p className="text-center text-neutral-500 py-8">No terms found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}