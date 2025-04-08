
import React from "react";
import { SearchX } from "lucide-react";

interface NoResultsProps {
  message?: string;
}

const NoResults: React.FC<NoResultsProps> = ({ 
  message = "No medicines found matching your criteria" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="bg-muted rounded-full p-4 mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground max-w-md">
        Try adjusting your search or filter criteria to find what you're looking for
      </p>
    </div>
  );
};

export default NoResults;
