import { Link } from "react-router-dom";

export const Footer = () => {
  const linkClass = "hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm";

  return (
    <footer className="border-t border-border py-12 bg-card/50" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
              <img src="/logo.png" alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
              <span className="font-semibold text-lg">Carbon Path</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping UK SMEs become sustainability ready with compliance tools, grants, and expert support.
            </p>
          </div>

          {/* Learn */}
          <nav aria-label="Learn resources">
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link to="/learn/what-is-sustainability-compliance" className={linkClass}>
                  What is Compliance?
                </Link>
              </li>
              <li>
                <Link to="/learn/uk-sustainability-regulations" className={linkClass}>
                  UK Regulations
                </Link>
              </li>
              <li>
                <Link to="/learn/evidence-locker-explained" className={linkClass}>
                  Building Your Evidence Locker
                </Link>
              </li>
              <li>
                <Link to="/learn/tax-incentives-overview" className={linkClass}>
                  Tax Incentives
                </Link>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link to="/grants" className={linkClass}>
                  Browse Grants
                </Link>
              </li>
              <li>
                <Link to="/consultants" className={linkClass}>
                  Find Consultants
                </Link>
              </li>
              <li>
                <Link to="/assessment" className={linkClass}>
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link to="/tax-benefits" className={linkClass}>
                  Tax Benefits Guide
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company information">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground" role="list">
              <li>
                <Link to="/about" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
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
