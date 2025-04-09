
import React from "react";
import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-medblue-600" />
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-medblue-600">Medi</span>
            <span className="text-xl font-bold text-medcyan-500">Compare</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            Home
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            About
          </Link>
          <Link to="#" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent/50 h-9 px-4 py-2">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
