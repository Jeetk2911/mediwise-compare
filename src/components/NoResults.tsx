
import React from "react";
import { SearchX, RefreshCw } from "lucide-react";

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
        Try adjusting your search or filter criteria to find what you're looking for
      </p>
      
      {usingDefaultData && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-medblue-100 text-medblue-700 rounded-md hover:bg-medblue-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try connecting to database</span>
        </button>
      )}
    </div>
  );
};

export default NoResults;
