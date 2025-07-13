import { useState } from "react";
import { Search, Book, Video, MessageCircle, Phone, Mail, ChevronRight, FileText, Users, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  popular: boolean;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  articleCount: number;
  color: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: Book,
    description: "Learn the basics of using our platform",
    articleCount: 12,
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "policy-management",
    name: "Policy Management",
    icon: Shield,
    description: "Managing your insurance policies",
    articleCount: 18,
    color: "bg-green-100 text-green-600"
  },
  {
    id: "claims-support",
    name: "Claims Support",
    icon: FileText,
    description: "Filing and tracking insurance claims",
    articleCount: 15,
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "account-settings",
    name: "Account Settings",
    icon: Users,
    description: "Managing your account and preferences",
    articleCount: 8,
    color: "bg-orange-100 text-orange-600"
  }
];

const helpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "How to upload and analyze your first policy",
    category: "Getting Started",
    description: "Step-by-step guide to getting started with policy analysis",
    readTime: "5 min read",
    popular: true
  },
  {
    id: "2",
    title: "Understanding your policy analysis results",
    category: "Policy Management",
    description: "Learn how to interpret the AI-generated insights",
    readTime: "3 min read",
    popular: true
  },
  {
    id: "3",
    title: "Setting up policy renewal reminders",
    category: "Policy Management",
    description: "Never miss a renewal date with automated reminders",
    readTime: "2 min read",
    popular: false
  },
  {
    id: "4",
    title: "How to file a claim through our platform",
    category: "Claims Support",
    description: "Complete guide to filing insurance claims",
    readTime: "7 min read",
    popular: true
  },
  {
    id: "5",
    title: "Managing your notification preferences",
    category: "Account Settings",
    description: "Customize when and how you receive notifications",
    readTime: "4 min read",
    popular: false
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularArticles = helpArticles.filter(article => article.popular);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Help Center</h1>
              <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                Find answers to common questions, browse helpful guides, or get in touch with our support team.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Search for help articles..."
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Video className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Video Tutorials</h3>
                    <p className="text-neutral-600 text-sm">Watch step-by-step guides</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Live Chat</h3>
                    <p className="text-neutral-600 text-sm">Get instant help from our team</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Phone className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-neutral-900 mb-2">Phone Support</h3>
                    <p className="text-neutral-600 text-sm">Call us at 1-800-HELP-NOW</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {helpCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card 
                      key={category.id} 
                      className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${category.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-neutral-900 mb-2">{category.name}</h3>
                        <p className="text-neutral-600 text-sm mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{category.articleCount} articles</Badge>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Popular Articles or Search Results */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {searchQuery ? 'Search Results' : selectedCategory || 'Popular Articles'}
                </h2>
                {selectedCategory && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory(null)}
                    className="text-primary-600"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-neutral-900">{article.title}</h3>
                            {article.popular && (
                              <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-neutral-600 mb-3">{article.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No articles found</h3>
                  <p className="text-neutral-600">
                    Try adjusting your search terms or browse our categories above.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-primary-50 to-blue-50">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Still need help?
                </h2>
                <p className="text-neutral-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="text-primary-600">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}