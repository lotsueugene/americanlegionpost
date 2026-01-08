import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
                <Star className="h-5 w-5 text-primary" fill="currentColor" />
              </div>
              <div>
                <p className="font-bold font-serif">American Legion</p>
                <p className="text-sm text-gold">Post #318</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Serving our veterans, community, and nation since 1919. 
              "For God and Country."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif font-bold text-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/history" className="hover:text-gold transition-colors">Our History</Link></li>
              <li><Link to="/officers" className="hover:text-gold transition-colors">Post Officers</Link></li>
              <li><Link to="/sons-of-legion" className="hover:text-gold transition-colors">Sons of the Legion</Link></li>
              <li><Link to="/hall-rentals" className="hover:text-gold transition-colors">Hall Rentals</Link></li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="mb-4 font-serif font-bold text-gold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/calendar" className="hover:text-gold transition-colors">Events Calendar</Link></li>
              <li><Link to="/gallery" className="hover:text-gold transition-colors">Photo Gallery</Link></li>
              <li><Link to="/memorials" className="hover:text-gold transition-colors">Veteran Memorials</Link></li>
              <li><a href="https://www.legion.org" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">National Legion</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-serif font-bold text-gold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold" />
                <span>11 Main Street<br />Parkville, MO 64152</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <span>(816) 741-5387</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <span>Americanlegion318@yahoo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} American Legion Post #318. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
