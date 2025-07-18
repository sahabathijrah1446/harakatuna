import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-glow transition-smooth">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
              Harakatuna
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/pro" 
              className={`text-sm font-medium transition-smooth hover:text-primary ${
                isActive('/pro') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Pro
            </Link>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Mulai Gratis</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/pro">Upgrade Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;