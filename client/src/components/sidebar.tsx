import { Link, useLocation } from "wouter";
import { Shield, ChartLine, BookOpen, UserCog, Lightbulb, HelpCircle, Headphones, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@shared/schema";

const navigationItems: NavigationItem[] = [
  {
    id: "policy-analysis",
    label: "Policy Analysis",
    icon: "chart-line",
    path: "/",
    category: "main"
  },
  {
    id: "glossary",
    label: "Glossary",
    icon: "book-open",
    path: "/glossary",
    category: "main"
  },
  {
    id: "personalized-management",
    label: "Personalized Management",
    icon: "user-cog",
    path: "/management",
    category: "main"
  },
  {
    id: "advanced-guidance",
    label: "Advanced Guidance",
    icon: "lightbulb",
    path: "/guidance",
    category: "main"
  },
  {
    id: "help-center",
    label: "Help Center",
    icon: "help-circle",
    path: "/help",
    category: "support"
  },
  {
    id: "contact-support",
    label: "Contact Support",
    icon: "headphones",
    path: "/support",
    category: "support"
  }
];

const IconComponent = ({ iconName }: { iconName: string }) => {
  const iconMap = {
    "chart-line": ChartLine,
    "book-open": BookOpen,
    "user-cog": UserCog,
    "lightbulb": Lightbulb,
    "help-circle": HelpCircle,
    "headphones": Headphones
  };
  
  const Icon = iconMap[iconName as keyof typeof iconMap] || ChartLine;
  return <Icon className="w-5 h-5" />;
};

export function Sidebar() {
  const [location] = useLocation();
  
  const mainItems = navigationItems.filter(item => item.category === "main");
  const supportItems = navigationItems.filter(item => item.category === "support");

  return (
    <div className="w-80 bg-white shadow-2xl border-r border-neutral-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary to-primary-700">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Demystifying</h1>
            <p className="text-primary-100 text-sm font-medium">Insurance</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
            Main Features
          </h2>
          
          {mainItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <div
                  className={cn(
                    "nav-item rounded-lg mb-2 transition-all duration-300 hover:translate-x-1",
                    isActive && "bg-primary-50 border-l-4 border-primary-600 rounded-r-lg"
                  )}
                >
                  <div className={cn(
                    "flex items-center px-3 py-3 font-medium transition-colors",
                    isActive
                      ? "text-primary-700"
                      : "text-neutral-700 hover:text-primary-600"
                  )}>
                    <IconComponent iconName={item.icon} />
                    <span className="ml-3">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="border-t border-neutral-200 pt-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
            Support
          </h2>
          
          {supportItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <div className="nav-item rounded-lg hover:bg-neutral-50 mb-2 transition-all duration-300 hover:translate-x-1">
                  <div className="flex items-center px-3 py-3 text-neutral-700 hover:text-primary-600 transition-colors">
                    <IconComponent iconName={item.icon} />
                    <span className="ml-3">{item.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
            <User className="text-white w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">John Doe</p>
            <p className="text-xs text-neutral-500">Premium Member</p>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
