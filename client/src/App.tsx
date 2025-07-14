import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Glossary from "@/pages/glossary";
import RecentChatsPage from "@/pages/recent-chats";
import HelpCenter from "@/pages/help-center";
import ContactSupport from "@/pages/contact-support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/recent" component={RecentChatsPage} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/support" component={ContactSupport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
