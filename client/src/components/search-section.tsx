import { useState, useRef } from "react";
import { Search, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Policy } from "@shared/schema";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface SearchSectionProps {
  onSearch: (results: Policy[]) => void;
  onFileUpload?: (file: File) => void;
  onQuerySubmit?: (query: string) => void;
  isLoading?: boolean;
}

export function SearchSection({ onSearch, onFileUpload, onQuerySubmit, isLoading = false }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!searchQuery.trim()) return;

    // If onQuerySubmit is provided, it means this is the main dashboard search.
    // The parent component is responsible for the API call and loading state.
    if (onQuerySubmit) {
      onQuerySubmit(searchQuery);
    } else {
      // Otherwise, this is a simple search (e.g., in PolicyComparison)
      // and this component handles its own state.
      // Note: We'd need to bring back the local isLoading state for this to work perfectly.
      // For now, we assume the parent manages loading if it's a complex search.
    try {
      const response = await fetch(`/api/policies/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Search failed.');
      const results = await response.json();
      onSearch(results);
    } catch (error) {
      console.error(error);
        onSearch([]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      console.log("File selected:", file.name);
      onFileUpload(file);
    }
  };

  const triggerFileSelect = (accept: string) => {
    if (fileInputRef.current) {
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-8 text-neutral-500 hover:text-neutral-900 rounded-full"
                        disabled={isLoading}
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => triggerFileSelect(".jpg,.jpeg,.png")}>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => triggerFileSelect(".pdf,.doc,.docx")}>
                        <FileText className="w-4 h-4 mr-2" />
                        Document
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-12 py-3 text-base border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all text-neutral-900 placeholder-neutral-500 h-10"
                placeholder="Search your policies or ask a question..."
                disabled={isLoading}
            />

            <Button 
                onClick={handleSubmit}
                disabled={isLoading || !searchQuery.trim()}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-8 text-neutral-500 hover:text-neutral-900 rounded-full"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                    <Search className="w-5 h-5" />
                )}
            </Button>
        </div>
        
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
    </div>
  );
}
