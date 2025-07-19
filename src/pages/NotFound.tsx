import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Cloud className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-bold gradient-cloud bg-clip-text text-transparent mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Oops! This page seems to have wandered off into dreamland.</p>
          <p className="text-muted-foreground mb-8">
            Don't worry, you can always return home to create more magical stories.
          </p>
        </div>
        <Button variant="accent" size="lg" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
