
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
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-medblue-600 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
