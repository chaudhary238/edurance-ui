import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, ChevronRight, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";

const coverageData = [
  { category: 'Auto', current: 80, recommended: 90 },
  { category: 'Health', current: 95, recommended: 95 },
  { category: 'Home', current: 70, recommended: 85 },
  { category: 'Life', current: 60, recommended: 80 },
  { category: 'Disability', current: 30, recommended: 70 },
  { category: 'Umbrella', current: 0, recommended: 60 }
];

const mythsData = [
  {
    id: "1",
    myth: "My standard homeowners insurance covers flood damage.",
    status: "debunked",
    explanation: "Standard homeowners insurance typically does not cover flood damage. You need separate flood insurance."
  },
  {
    id: "2", 
    myth: "The cheapest insurance policy is always the best choice.",
    status: "debunked",
    explanation: "While cost is important, the cheapest policy may not provide adequate coverage for your needs."
  },
  {
    id: "3",
    myth: "If I have health insurance, all my medical costs are covered.",
    status: "debunked",
    explanation: "Health insurance typically involves deductibles, co-pays, and co-insurance that you'll need to pay."
  }
];

export default function AdvancedGuidance() {
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [selectedDependents, setSelectedDependents] = useState("");
  const [selectedFinancialStatus, setSelectedFinancialStatus] = useState("");
  const [expandedMyth, setExpandedMyth] = useState<string | null>(null);

  const handleNeedsAnalysis = () => {
    // TODO: Implement needs analysis logic
    console.log("Analyze needs based on:", {
      maritalStatus: selectedMaritalStatus,
      dependents: selectedDependents,
      financialStatus: selectedFinancialStatus
    });
  };

  const toggleMyth = (mythId: string) => {
    setExpandedMyth(expandedMyth === mythId ? null : mythId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Advanced Guidance</h1>
              <p className="text-neutral-600 text-lg">
                Advanced tools and insights to optimize your insurance coverage and make informed decisions.
              </p>
            </div>

            {/* Coverage Gap Identification */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Coverage Gap Identification</h2>
              <p className="text-neutral-600 mb-6">
                This chart illustrates your estimated coverage levels against our recommendations to highlight potential gaps.
              </p>
              
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Estimated Coverage Adequacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coverageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="current" fill="#3b82f6" name="Current Coverage" />
                        <Bar dataKey="recommended" fill="#10b981" name="Recommended Coverage" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-sm text-neutral-600">Current Coverage</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm text-neutral-600">Recommended Coverage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Needs Analysis Tool */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Needs Analysis Tool</h2>
              <p className="text-neutral-600 mb-6">
                Answer a few simple questions to get a tailored insurance recommendation.
              </p>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="marital-status">What is your marital status?</Label>
                      <Select value={selectedMaritalStatus} onValueChange={setSelectedMaritalStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dependents">How many dependents do you have?</Label>
                      <Select value={selectedDependents} onValueChange={setSelectedDependents}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 Children</SelectItem>
                          <SelectItem value="1">1 Child</SelectItem>
                          <SelectItem value="2">2 Children</SelectItem>
                          <SelectItem value="3+">3+ Children</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="financial-status">What are your major financial assets?</Label>
                      <Select value={selectedFinancialStatus} onValueChange={setSelectedFinancialStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home Owner</SelectItem>
                          <SelectItem value="mortgage">Mortgage Holder</SelectItem>
                          <SelectItem value="renter">Renter</SelectItem>
                          <SelectItem value="investments">Investment Portfolio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={handleNeedsAnalysis}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2"
                      disabled={!selectedMaritalStatus || !selectedDependents || !selectedFinancialStatus}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Analyze My Needs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Myth Debunking Center */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Myth Debunking Center</h2>
              <p className="text-neutral-600 mb-6">
                Click on a myth to reveal the truth. Knowledge is your best policy.
              </p>
              
              <div className="space-y-4">
                {mythsData.map((myth) => (
                  <Card key={myth.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleMyth(myth.id)}
                        className="w-full text-left p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          <span className="font-medium text-neutral-900">{myth.myth}</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-neutral-400 transition-transform ${expandedMyth === myth.id ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {expandedMyth === myth.id && (
                        <div className="px-6 pb-6 border-t border-neutral-200 bg-red-50">
                          <div className="pt-4 flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-neutral-900 mb-2">Truth:</h4>
                              <p className="text-neutral-700">{myth.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Get Professional Advice */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <HelpCircle className="w-8 h-8 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Need Professional Advice?
                  </h2>
                </div>
                <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                  While our tools provide valuable insights, complex insurance decisions may benefit from professional guidance. 
                  Connect with licensed insurance advisors for personalized recommendations.
                </p>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                  Connect with an Advisor
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}