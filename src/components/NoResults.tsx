
import React from "react";
import { SearchX, Database } from "lucide-react";

interface NoResultsProps {
  message?: string;
  isConnectionIssue?: boolean;
  onRetry?: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ 
  message = "No medicines found matching your criteria",
  isConnectionIssue = false,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="bg-muted rounded-full p-4 mb-4">
        {isConnectionIssue ? 
          <Database className="h-10 w-10 text-red-500" /> :
          <SearchX className="h-10 w-10 text-muted-foreground" />
        }
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {isConnectionIssue 
          ? "There was an issue connecting to the database. Please check your connection or try again later."
          : "Try adjusting your search or filter criteria to find what you're looking for."
        }
      </p>
      
      {isConnectionIssue && onRetry && (
        <button
          onClick={onRetry}
          className="bg-medblue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-medblue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default NoResults;
