import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Home, Car, ArrowRight } from "lucide-react";
import { Policy } from "@shared/schema";

const getPolicyIcon = (policyType: string) => {
  const iconMap = {
    "auto": Car,
    "home": Home,
    "life": FileText,
    "health": FileText
  };
  
  const Icon = iconMap[policyType.toLowerCase() as keyof typeof iconMap] || FileText;
  return Icon;
};

const getPolicyColor = (policyType: string) => {
  const colorMap = {
    "auto": "bg-primary-100 text-primary-600",
    "home": "bg-green-100 text-green-600",
    "life": "bg-purple-100 text-purple-600",
    "health": "bg-orange-100 text-orange-600"
  };
  
  return colorMap[policyType.toLowerCase() as keyof typeof colorMap] || "bg-primary-100 text-primary-600";
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(parseFloat(amount));
};

const formatDate = (date: Date | null) => {
  if (!date) return "Not analyzed";
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

export function RecentPolicies() {
  const { data: policies, isLoading } = useQuery<Policy[]>({
    queryKey: ['/api/policies'],
  });

  const handlePolicyClick = (policyId: number) => {
    // TODO: Navigate to policy detail page
    console.log("View policy:", policyId);
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-lg border border-neutral-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Recent Policies</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-neutral-200 rounded-xl p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-32" />
                      <div className="h-3 bg-neutral-200 rounded w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-20" />
                    <div className="h-3 bg-neutral-200 rounded w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg border border-neutral-200">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-900">Recent Policies</h2>
          <Button
            variant="ghost"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {policies && policies.length > 0 ? (
            policies.slice(0, 3).map((policy) => {
              const PolicyIcon = getPolicyIcon(policy.policyType);
              const colorClasses = getPolicyColor(policy.policyType);
              
              return (
                <div
                  key={policy.id}
                  className="border border-neutral-200 rounded-xl p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => handlePolicyClick(policy.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                        <PolicyIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{policy.policyName}</h3>
                        <p className="text-sm text-neutral-600">Policy #: {policy.policyNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-neutral-900">
                          {formatCurrency(policy.premiumAmount)}/year
                        </p>
                        <p className="text-xs text-neutral-500">
                          Last analyzed: {formatDate(policy.lastAnalyzed)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600 hover:text-primary-700 p-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Policies Found</h3>
              <p className="text-neutral-600">
                You haven't added any policies yet. Start by uploading your first policy document.
              </p>
              <Button className="mt-4 bg-primary-600 hover:bg-primary-700">
                Add Your First Policy
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
