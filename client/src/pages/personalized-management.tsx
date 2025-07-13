import { useState } from "react";
import { AlertTriangle, TrendingUp, TrendingDown, Calendar, Eye, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";

interface PolicyInsight {
  id: string;
  type: "increase" | "decrease" | "warning";
  title: string;
  description: string;
  percentage?: number;
  dueDate?: string;
  action: string;
}

interface LifeEvent {
  id: string;
  event: string;
  description: string;
  impact: string;
  action: string;
}

const policyInsights: PolicyInsight[] = [
  {
    id: "1",
    type: "increase",
    title: "Auto Insurance Rate Increase",
    description: "Your annual policy with AllState/Co is due for renewal. The premium has increased due to regional accident rate changes.",
    percentage: 8,
    dueDate: "30 days",
    action: "Review Options"
  },
  {
    id: "2",
    type: "warning",
    title: "Health Insurance Payment",
    description: "Your monthly premium for your BlueCross plan is due soon. No changes to your premium rate.",
    dueDate: "5 days",
    action: "No Change"
  },
  {
    id: "3",
    type: "decrease",
    title: "Home Insurance Renewal",
    description: "Your policy rate decreased to lowering. Your premium has decreased thanks to your claims-free record.",
    percentage: 2,
    dueDate: "15 days",
    action: "2%"
  }
];

const lifeEvents: LifeEvent[] = [
  {
    id: "1",
    event: "New Baby",
    description: "Life changes: Your insurance should too. See how major events impact your coverage needs.",
    impact: "Life Event Impact Analysis",
    action: "New Baby"
  },
  {
    id: "2",
    event: "Home Purchase",
    description: "Life changes: Your insurance should too. See how major events impact your coverage needs.",
    impact: "Life Event Impact Analysis",
    action: "Home Purchase"
  }
];

export default function PersonalizedManagement() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case "decrease":
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "increase":
        return "bg-red-50 border-red-200";
      case "decrease":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Proactive Policy Management</h1>
              <p className="text-neutral-600 text-lg">
                Don't wait until it's too late - let's help you stay ahead with timely reminders and insights, 
                turning your insurance from a static document into a dynamic part of your financial life.
              </p>
            </div>

            {/* Policy Insights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Policy Insights</h2>
              <div className="space-y-4">
                {policyInsights.map((insight) => (
                  <Card key={insight.id} className={`border-2 ${getInsightColor(insight.type)} hover:shadow-lg transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-neutral-900">{insight.title}</h3>
                              {insight.percentage && (
                                <Badge variant={insight.type === "increase" ? "destructive" : "secondary"}>
                                  {insight.type === "increase" ? "+" : ""}{insight.percentage}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-neutral-700 mb-3">{insight.description}</p>
                            {insight.dueDate && (
                              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                                <Calendar className="w-4 h-4" />
                                <span>Due in {insight.dueDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Life Event Impact Analysis */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Life Event Impact Analysis</h2>
              <p className="text-neutral-600 mb-6">
                Life changes: Your insurance should too. See how major events impact your coverage needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lifeEvents.map((event) => (
                  <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="font-semibold text-neutral-900 mb-2">{event.impact}</h3>
                        <p className="text-neutral-600 text-sm mb-4">{event.description}</p>
                        <div className="flex justify-center space-x-3">
                          <Button variant="outline" size="sm" className="text-primary-600">
                            {event.action}
                          </Button>
                          <Button variant="outline" size="sm" className="text-primary-600">
                            Home Purchase
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Personalized Advice Section */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Select a life event to see personalized advice.
                </h2>
                <p className="text-neutral-600 mb-6">
                  Get tailored recommendations based on your specific situation and current coverage.
                </p>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                  Get Personalized Advice
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}