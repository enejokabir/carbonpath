import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, Menu, X, Calculator, Settings } from "lucide-react";
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
    const base = "text-sm font-medium transition-colors hover:text-primary";
    return isActive(path)
      ? `${base} text-primary`
      : `${base} text-muted-foreground`;
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-mint-fresh flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-sage-dark bg-clip-text text-transparent">
            Carbon Path
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Public navigation items */}
          <Link to="/calculator" className={navLinkClass("/calculator")}>
            Calculator
          </Link>
          <Link to="/grants" className={navLinkClass("/grants")}>
            Grants & Subsidies
          </Link>
          <Link to="/consultants" className={navLinkClass("/consultants")}>
            Consultants
          </Link>
          <Link to="/learn" className={navLinkClass("/learn")}>
            Learn
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>

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
              <Link to="/assessment">Start Assessment</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              to="/calculator"
              className={`py-2 px-3 rounded-lg ${isActive("/calculator") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Carbon Calculator
            </Link>
            <Link
              to="/grants"
              className={`py-2 px-3 rounded-lg ${isActive("/grants") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Grants & Subsidies
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
                <Link
                  to="/dashboard"
                  className={`py-2 px-3 rounded-lg ${isActive("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

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
                  <Link to="/assessment" onClick={() => setMobileMenuOpen(false)}>
                    Start Assessment
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
