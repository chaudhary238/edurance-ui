import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/sidebar";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  example?: string;
  category: string;
}

const glossaryTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "Accident",
    definition: "A sudden, unforeseen, and involuntary event caused by external, visible, and violent means.",
    example: "Extracted from policy document.",
    category: "General"
  },
  {
    id: "2",
    term: "Beneficiary",
    definition: "The person or entity designated to receive the benefits of an insurance policy upon the death of the insured.",
    example: "John Smith names his wife as the primary beneficiary of his life insurance policy.",
    category: "Life Insurance"
  },
  {
    id: "3",
    term: "Co-payment",
    definition: "A fixed amount that an insured person pays for covered healthcare services, usually at the time of service.",
    example: "A $20 co-payment for a doctor's visit.",
    category: "Health Insurance"
  },
  {
    id: "4",
    term: "Coinsurance",
    definition: "The percentage of costs of a covered healthcare service you pay after you've paid your deductible.",
    example: "After meeting your deductible, you pay 20% coinsurance for covered services.",
    category: "Health Insurance"
  },
  {
    id: "5",
    term: "Condition Precedent",
    definition: "A condition that must be fulfilled before an insurance policy becomes effective or before the insurer is liable to pay a claim.",
    example: "Installing a security system before homeowner's insurance coverage begins.",
    category: "General"
  },
  {
    id: "6",
    term: "Deductible",
    definition: "The amount you pay for covered healthcare services before your insurance plan starts to pay.",
    example: "With a $1,000 deductible, you pay the first $1,000 of covered services yourself.",
    category: "General"
  },
  {
    id: "7",
    term: "Premium",
    definition: "The amount you pay for your insurance policy, typically monthly, quarterly, or annually.",
    example: "Your auto insurance premium is $150 per month.",
    category: "General"
  },
  {
    id: "8",
    term: "Underwriting",
    definition: "The process by which insurers evaluate the risk of insuring a home, car, or individual's health or life.",
    example: "The underwriting process for life insurance may include a medical exam.",
    category: "General"
  }
];

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTerm = (termId: string) => {
    setExpandedTerm(expandedTerm === termId ? null : termId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Jargon Buster & Glossary</h1>
              <p className="text-neutral-600 text-lg">
                Search our glossary or click a term below to get a simple explanation.
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search for a term (e.g., Deductible)"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredTerms.map((term) => (
                <Card key={term.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleTerm(term.id)}
                      className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-primary-600">{term.term}</span>
                        <span className="text-sm text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
                          {term.category}
                        </span>
                      </div>
                      {expandedTerm === term.id ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                    
                    {expandedTerm === term.id && (
                      <div className="px-6 pb-6 border-t border-neutral-200 bg-neutral-50">
                        <div className="pt-4">
                          <h4 className="font-semibold text-neutral-900 mb-2">What it means:</h4>
                          <p className="text-neutral-700 mb-4">{term.definition}</p>
                          
                          {term.example && (
                            <div>
                              <h4 className="font-semibold text-neutral-900 mb-2">Real-world example:</h4>
                              <p className="text-neutral-600 italic">{term.example}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTerms.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No terms found</h3>
                <p className="text-neutral-600">
                  Try searching for a different term or browse all available terms.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}