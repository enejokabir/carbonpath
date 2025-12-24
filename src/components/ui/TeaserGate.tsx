import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, PoundSterling, Users, ArrowRight } from "lucide-react";

interface TeaserGateProps {
  type: "grants" | "consultants" | "subsidies";
  hiddenCount: number;
  className?: string;
}

export function TeaserGate({ type, hiddenCount, className = "" }: TeaserGateProps) {
  const config = {
    grants: {
      icon: PoundSterling,
      title: `${hiddenCount} more grants available`,
      description: "Sign in to see grants matched to your business profile and eligibility",
      cta: "Sign in to unlock",
    },
    subsidies: {
      icon: PoundSterling,
      title: `${hiddenCount} more tax reliefs & subsidies available`,
      description: "Sign in to see which subsidies your business qualifies for",
      cta: "Sign in to unlock",
    },
    consultants: {
      icon: Users,
      title: `${hiddenCount} more vetted consultants available`,
      description: "Sign in to connect with experts matched to your needs",
      cta: "Sign in to unlock",
    },
  };

  const { icon: Icon, title, description, cta } = config[type];

  return (
    <Card className={`border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent ${className}`}>
      <CardContent className="py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/auth">
              {cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/assessment">Take Readiness Check First</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface BlurredCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BlurredCard({ children, className = "" }: BlurredCardProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-center justify-center">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Sign in to view</span>
        </div>
      </div>
    </div>
  );
}
