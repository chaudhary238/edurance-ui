import { useState } from "react";
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";

interface ContactMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
  availability: string;
  responseTime: string;
  color: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: "live-chat",
    name: "Live Chat",
    icon: MessageCircle,
    description: "Get instant help from our support team",
    availability: "24/7",
    responseTime: "< 2 minutes",
    color: "bg-green-100 text-green-600"
  },
  {
    id: "phone",
    name: "Phone Support",
    icon: Phone,
    description: "Speak directly with a support specialist",
    availability: "Mon-Fri 8AM-8PM EST",
    responseTime: "Immediate",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "email",
    name: "Email Support",
    icon: Mail,
    description: "Send us a detailed message",
    availability: "24/7",
    responseTime: "< 4 hours",
    color: "bg-purple-100 text-purple-600"
  }
];

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Show success message or redirect
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-neutral-50">
          <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-neutral-900 mb-3">Contact Support</h1>
              <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                Need help? We're here for you. Choose the best way to reach our support team.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Choose Your Preferred Contact Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card key={method.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${method.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-neutral-900 mb-2">{method.name}</h3>
                        <p className="text-neutral-600 text-sm mb-4">{method.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Availability:</span>
                            <Badge variant="secondary" className="text-xs">{method.availability}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Response Time:</span>
                            <Badge variant="outline" className="text-xs">{method.responseTime}</Badge>
                          </div>
                        </div>
                        <Button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white">
                          {method.name === "Live Chat" && "Start Chat"}
                          {method.name === "Phone Support" && "Call Now"}
                          {method.name === "Email Support" && "Send Email"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="mb-12">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">Send us a Message</CardTitle>
                  <p className="text-neutral-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing & Account</SelectItem>
                            <SelectItem value="policy">Policy Questions</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please provide detailed information about your issue..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-primary-600" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">Toll-Free:</span>
                      <span className="text-primary-600">1-800-HELP-NOW</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">Monday - Friday: 8AM - 8PM EST</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">Weekend: 9AM - 5PM EST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary-600" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">General Support:</span>
                      <span className="text-primary-600">support@demystifyinginsurance.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">Technical Issues:</span>
                      <span className="text-primary-600">tech@demystifyinginsurance.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600">We typically respond within 4 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}