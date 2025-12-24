import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import LearnArticle from "./pages/LearnArticle";
import Assessment from "./pages/Assessment";
import Grants from "./pages/Grants";
import Consultants from "./pages/Consultants";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TaxBenefits from "./pages/TaxBenefits";
import ProfileEdit from "./pages/ProfileEdit";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Consultant pages
import ConsultantRegister from "./pages/ConsultantRegister";
import ConsultantDashboard from "./pages/ConsultantDashboard";

// Workspace pages
import OnboardingFlow from "./pages/onboarding/OnboardingFlow";
import WorkspaceDashboard from "./pages/workspace/WorkspaceDashboard";
import EvidenceLocker from "./pages/workspace/EvidenceLocker";
import ComplianceCalendar from "./pages/workspace/ComplianceCalendar";
import WorkspaceSettings from "./pages/workspace/WorkspaceSettings";
import Checklist from "./pages/workspace/Checklist";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGrants from "./pages/admin/AdminGrants";
import AdminSubsidies from "./pages/admin/AdminSubsidies";
import AdminConsultants from "./pages/admin/AdminConsultants";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<LearnArticle />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/grants" element={<Grants />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tax-benefits" element={<TaxBenefits />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />

          {/* Workspace Routes */}
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/workspace/dashboard" element={<WorkspaceDashboard />} />
          <Route path="/workspace/checklist" element={<Checklist />} />
          <Route path="/workspace/evidence" element={<EvidenceLocker />} />
          <Route path="/workspace/calendar" element={<ComplianceCalendar />} />
          <Route path="/workspace/settings" element={<WorkspaceSettings />} />

          {/* Consultant Routes */}
          <Route path="/consultant/register" element={<ConsultantRegister />} />
          <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="grants" element={<AdminGrants />} />
            <Route path="subsidies" element={<AdminSubsidies />} />
            <Route path="consultants" element={<AdminConsultants />} />
          </Route>

          {/* Legal Pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
