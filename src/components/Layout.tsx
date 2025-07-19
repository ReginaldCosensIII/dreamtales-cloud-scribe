import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/UserDropdown";
import { 
  Cloud, 
  Menu,
  X,
  Instagram,
  Twitter,
  Youtube,
  Heart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/70">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${
                  location.pathname === '/' ? 'text-primary font-medium after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${
                  location.pathname === '/about' ? 'text-primary font-medium after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                About
              </Link>
              <Link 
                to="/generator" 
                className={`text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-transform after:duration-300 ${
                  location.pathname === '/generator' ? 'text-primary font-medium after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                Generator
              </Link>
              {user ? (
                <UserDropdown />
              ) : (
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`transition-colors ${
                    location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`transition-colors ${
                    location.pathname === '/about' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/generator" 
                  className={`transition-colors ${
                    location.pathname === '/generator' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Generator
                </Link>
                {user ? (
                  <UserDropdown />
                ) : (
                  <Button variant="secondary" size="sm" asChild>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-card/50 backdrop-blur-sm border-t border-border/50 mt-auto overflow-hidden">
        {/* Cloud background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-1/4 w-16 h-8 bg-primary/10 rounded-full animate-cloud-float" />
          <div className="absolute top-8 right-1/3 w-20 h-10 bg-primary/8 rounded-full animate-cloud-drift-slow" />
          <div className="absolute bottom-4 left-1/2 w-12 h-6 bg-primary/12 rounded-full animate-cloud-drift" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold gradient-cloud bg-clip-text text-transparent">DreamTales AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Creating magical bedtime stories that bring families together, one tale at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/generator" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Story Generator
                </Link>
                {user && (
                  <Link to="/account" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Account
                  </Link>
                )}
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <Link to="/social-partnership" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Creator Partnership
                </Link>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 DreamTales AI. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for families
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;