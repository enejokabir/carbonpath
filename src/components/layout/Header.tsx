import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConsultant, setIsConsultant] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check if admin
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();

        setIsAdmin(!!adminRole);

        // Check if consultant
        const { data: consultantProfile } = await supabase
          .from("consultants")
          .select("status")
          .eq("user_id", session.user.id)
          .single();

        setIsConsultant(!!consultantProfile);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsAdmin(false);
        setIsConsultant(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out: " + error.message);
    } else {
      navigate("/auth");
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navLinkClass = (path: string) => {
    const base = "text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm pb-1";
    return isActive(path)
      ? `${base} text-primary border-b-2 border-primary`
      : `${base} text-muted-foreground`;
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
          <img
            src="/logo.png"
            alt="Carbon Path"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-sage-dark bg-clip-text text-transparent">
            Carbon Path
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
          {/* My Workspace first for logged-in users */}
          {user && (
            <Link to="/workspace/dashboard" className={navLinkClass("/workspace")}>
              My Workspace
            </Link>
          )}

          {/* Public navigation items */}
          <Link to="/assessment" className={navLinkClass("/assessment")}>
            Readiness Check
          </Link>
          <Link to="/grants" className={navLinkClass("/grants")}>
            Grants
          </Link>
          <Link to="/consultants" className={navLinkClass("/consultants")}>
            Consultants
          </Link>
          <Link to="/learn" className={navLinkClass("/learn")}>
            Learn
          </Link>

          {user ? (
            <>
              {isConsultant && (
                <Link to="/consultant/dashboard" className={navLinkClass("/consultant")}>
                  Consultant Portal
                </Link>
              )}

              {isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Link>
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card" id="mobile-navigation" role="navigation" aria-label="Mobile navigation">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {/* My Workspace first for logged-in users */}
            {user && (
              <Link
                to="/workspace/dashboard"
                className={`py-2 px-3 rounded-lg font-medium ${isActive("/workspace") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Workspace
              </Link>
            )}

            <Link
              to="/assessment"
              className={`py-2 px-3 rounded-lg ${isActive("/assessment") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Readiness Check
            </Link>
            <Link
              to="/grants"
              className={`py-2 px-3 rounded-lg ${isActive("/grants") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Grants
            </Link>
            <Link
              to="/consultants"
              className={`py-2 px-3 rounded-lg ${isActive("/consultants") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Consultants
            </Link>
            <Link
              to="/learn"
              className={`py-2 px-3 rounded-lg ${isActive("/learn") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Learn
            </Link>

            {user ? (
              <>
                {isConsultant && (
                  <Link
                    to="/consultant/dashboard"
                    className={`py-2 px-3 rounded-lg ${isActive("/consultant") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Consultant Portal
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`py-2 px-3 rounded-lg ${isActive("/admin") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Portal
                  </Link>
                )}

                <div className="pt-2 mt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-2 mt-2 border-t border-border">
                <Button asChild className="w-full">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
      </header>
    </>
  );
};
