import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "History", href: "/history" },
  { name: "Gallery", href: "/gallery" },
  { name: "Officers", href: "/officers" },
  { name: "Sons of the Legion", href: "/sons-of-legion" },
  { name: "Hall Rentals", href: "/hall-rentals" },
  { name: "Calendar", href: "/calendar" },
  { name: "Memorials", href: "/memorials" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-elevated">
      <nav className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/american-legion-logo.png"
              alt="American Legion Logo"
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-primary-foreground font-serif">
                American Legion
              </p>
              <p className="text-sm text-gold">Post #318</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  location.pathname === item.href
                    ? "text-gold bg-primary-foreground/10"
                    : "text-primary-foreground/90 hover:text-gold hover:bg-primary-foreground/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? "text-gold bg-primary-foreground/10"
                      : "text-primary-foreground/90 hover:text-gold hover:bg-primary-foreground/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
