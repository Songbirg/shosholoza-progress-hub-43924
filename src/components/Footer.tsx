import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SHOSH</h3>
            <p className="text-sm text-primary-foreground/80">
              Building a better South Africa through social democracy, equal opportunity, and prosperity for all.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/founder" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Our Founder
                </Link>
              </li>
              <li>
                <Link to="/values" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Our Values
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/membership" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Join the Party
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-smooth">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Shosholoza Progressive Party. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
