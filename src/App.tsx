import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Gallery from "./pages/Gallery";
import Officers from "./pages/Officers";
import SonsOfLegion from "./pages/SonsOfLegion";
import HallRentals from "./pages/HallRentals";
import CalendarPage from "./pages/Calendar";
import Memorials from "./pages/Memorials";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/sons-of-legion" element={<SonsOfLegion />} />
          <Route path="/hall-rentals" element={<HallRentals />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/memorials" element={<Memorials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
