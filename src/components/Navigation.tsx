import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "./ui/button";
import shoshLogo from "@/assets/shosh-logo.png";
import manifestoPdf from "../../images/Manifesto 2026 .pdf";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Shosh News", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Our Founder", path: "/founder" },
    { name: "Values", path: "/values" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center">
            <img
              src={shoshLogo}
              alt="Shosholoza Progressive Party"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-smooth relative group ${
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-foreground transform origin-left transition-transform duration-300 ${isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                ></span>
              </Link>
            ))}
            <a 
              href={manifestoPdf} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-scale inline-block"
            >
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Manifesto
              </Button>
            </a>
            <Link to="/candidate" className="hover-scale inline-block">
              <Button variant="hero" size="sm">
                Join Shosh
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-3 text-sm font-medium transition-smooth ${
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a 
              href={manifestoPdf} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full mt-4 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Download Manifesto
              </Button>
            </a>
            <Link to="/candidate" onClick={() => setIsOpen(false)}>
              <Button variant="hero" size="sm" className="w-full mt-2">
                Join Shosh
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
