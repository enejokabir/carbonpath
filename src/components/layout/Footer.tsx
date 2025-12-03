import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">Carbon Path</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping UK SMEs navigate Net Zero with grants, guidance, and expert support.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/learn/what-is-net-zero" className="hover:text-primary transition-colors">
                  What is Net Zero?
                </Link>
              </li>
              <li>
                <Link to="/learn/uk-net-zero-targets" className="hover:text-primary transition-colors">
                  UK Policy & Targets
                </Link>
              </li>
              <li>
                <Link to="/learn/carbon-footprint-explained" className="hover:text-primary transition-colors">
                  Carbon Footprint Explained
                </Link>
              </li>
              <li>
                <Link to="/learn/tax-incentives-overview" className="hover:text-primary transition-colors">
                  Tax Incentives
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/grants" className="hover:text-primary transition-colors">
                  Browse Grants
                </Link>
              </li>
              <li>
                <Link to="/consultants" className="hover:text-primary transition-colors">
                  Find Consultants
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="hover:text-primary transition-colors">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link to="/tax-benefits" className="hover:text-primary transition-colors">
                  Tax Benefits Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Carbon Path. Supporting UK SMEs on their sustainability journey.
            </p>
            <p className="text-xs text-muted-foreground max-w-xl text-center md:text-right">
              Carbon Path provides general guidance only. We are not financial, tax, or legal advisors.
              Grant eligibility is determined by funding bodies. Consultants are independent professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
