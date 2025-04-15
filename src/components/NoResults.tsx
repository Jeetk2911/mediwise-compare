
import React from "react";
import { SearchX, RefreshCw, Database } from "lucide-react";

interface NoResultsProps {
  message?: string;
  onRetry?: () => void;
  usingDefaultData?: boolean;
}

const NoResults: React.FC<NoResultsProps> = ({ 
  message = "No medicines found matching your criteria",
  onRetry,
  usingDefaultData = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="bg-muted rounded-full p-4 mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        {usingDefaultData 
          ? "Currently using sample data. Unable to connect to the database."
          : "Try adjusting your search or filter criteria to find what you're looking for"}
      </p>
      
      {onRetry && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-medblue-100 text-medblue-700 rounded-md hover:bg-medblue-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4 animate-spin-slow" />
            <span>{usingDefaultData ? "Try connecting to database" : "Refresh search results"}</span>
          </button>
          
          {usingDefaultData && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-amber-700">Database Connection Tips:</span>
              </div>
              <ul className="text-sm text-amber-700 text-left list-disc pl-5 space-y-1">
                <li>Verify that your Supabase project is active</li>
                <li>Check that the medicines table exists with the correct schema</li>
                <li>Ensure your connection URL and API keys are correct</li>
                <li>Check if any row-level security policies might be restricting access</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoResults;
