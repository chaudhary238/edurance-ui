import { QueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, params] = queryKey;
        
        if (typeof url !== 'string') {
          throw new Error("Query key must be a URL string");
        }
        
        const fullUrl = new URL(url, window.location.origin);
        
        if (params && typeof params === 'object') {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              fullUrl.searchParams.append(key, String(value));
            }
          });
        }

        try {
          const response = await fetch(fullUrl.toString());

          if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
          }
          
          return await response.json();

        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Zod validation error:", error.errors);
            throw new Error("Data validation failed!");
          } else if (error instanceof Error) {
            console.error("Fetch error:", error.message);
            throw error;
          }
          throw new Error("An unknown error occurred during fetch");
        }
      },
      staleTime: 1000 * 60, // 1 minute
    },
  },
});
