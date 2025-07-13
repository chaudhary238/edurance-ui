import { Upload, History, MessageCircle, Plus, Clock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickAction } from "@shared/schema";

const quickActions: QuickAction[] = [
  {
    id: "upload-document",
    title: "Upload Document",
    description: "Analyze PDF policies",
    icon: "upload",
    color: "blue",
    action: "upload"
  },
  {
    id: "recent-analysis",
    title: "Recent Analysis",
    description: "View past reports",
    icon: "history",
    color: "green",
    action: "history"
  },
  {
    id: "ai-assistant",
    title: "AI Assistant",
    description: "Get instant help",
    icon: "bot",
    color: "purple",
    action: "ai"
  }
];

const IconComponent = ({ iconName, className }: { iconName: string; className?: string }) => {
  const iconMap = {
    "upload": Upload,
    "history": History,
    "bot": Bot
  };
  
  const Icon = iconMap[iconName as keyof typeof iconMap] || Upload;
  return <Icon className={className} />;
};

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600"
  };
  return colorMap[color as keyof typeof colorMap] || "bg-blue-100 text-blue-600";
};

export function QuickActions() {
  const handleAction = (action: string) => {
    switch (action) {
      case "upload":
        // TODO: Implement file upload functionality
        console.log("Upload document");
        break;
      case "history":
        // TODO: Navigate to history page
        console.log("View history");
        break;
      case "ai":
        // TODO: Open AI assistant
        console.log("Open AI assistant");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {quickActions.map((action) => (
        <Card key={action.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${getColorClasses(action.color)}`}>
                <IconComponent iconName={action.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{action.title}</h3>
                <p className="text-sm text-neutral-600">{action.description}</p>
              </div>
            </div>
            <Button
              onClick={() => handleAction(action.action)}
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              variant="ghost"
            >
              {action.icon === "upload" && <Plus className="w-4 h-4 mr-2" />}
              {action.icon === "history" && <Clock className="w-4 h-4 mr-2" />}
              {action.icon === "bot" && <MessageCircle className="w-4 h-4 mr-2" />}
              {action.title.split(" ")[0]} {action.title.split(" ")[1]}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
