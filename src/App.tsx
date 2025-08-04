import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import StoryCreator from "./pages/StoryCreator";
import StoryBuilder from "./pages/StoryBuilder";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import SocialPartnership from "./pages/SocialPartnership";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/generator" element={<StoryCreator />} />
            <Route path="/creator" element={<StoryCreator />} />
            <Route path="/builder" element={<StoryBuilder />} />
            <Route path="/account" element={<Account />} />
            <Route path="/social-partnership" element={<SocialPartnership />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
