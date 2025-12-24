import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@/types";

// =============================================================================
// TYPES
// =============================================================================

interface ContactFormData {
  name: string;
  email: string;
  businessName: string;
  subject: string;
  message: string;
}

const CONTACT_SUBJECTS = [
  { value: "general", label: "General Enquiry" },
  { value: "grants", label: "Questions about Grants" },
  { value: "consultants", label: "Becoming a Consultant" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "feedback", label: "Feedback on Platform" },
  { value: "support", label: "Technical Support" },
  { value: "other", label: "Other" },
] as const;

// =============================================================================
// COMPONENT
// =============================================================================

export default function Contact() {
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    businessName: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Try to save to Supabase if configured
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("contact_submissions").insert({
          name: formData.name,
          email: formData.email,
          business_name: formData.businessName || null,
          subject: formData.subject,
          message: formData.message,
          user_id: user?.id || null,
          status: "new",
        });

        if (error) {
          // If table doesn't exist, fall back to localStorage
          if (error.code === "42P01") {
            saveToLocalStorage();
          } else {
            throw error;
          }
        }
      } else {
        // Save to localStorage as fallback
        saveToLocalStorage();
      }

      toast.success("Message sent! We'll get back to you soon.");
      setIsSubmitted(true);
    } catch (error) {
      // Fallback to localStorage on any error
      saveToLocalStorage();
      toast.success("Message sent! We'll get back to you soon.");
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalStorage = () => {
    const submissions = JSON.parse(localStorage.getItem("contact_submissions") || "[]");
    submissions.push({
      ...formData,
      id: `contact-${Date.now()}`,
      submitted_at: new Date().toISOString(),
    });
    localStorage.setItem("contact_submissions", JSON.stringify(submissions));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      businessName: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? Want to learn more about Carbon Path? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:hello@carbonpath.co.uk"
                        className="text-muted-foreground text-sm hover:text-primary"
                      >
                        hello@carbonpath.co.uk
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground text-sm">
                        Derby, East Midlands<br />
                        United Kingdom
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/assessment" className="text-primary hover:underline">
                        Take Assessment
                      </Link>
                    </li>
                    <li>
                      <Link to="/grants" className="text-primary hover:underline">
                        Browse Grants
                      </Link>
                    </li>
                    <li>
                      <Link to="/consultants" className="text-primary hover:underline">
                        Find Consultants
                      </Link>
                    </li>
                    <li>
                      <Link to="/learn" className="text-primary hover:underline">
                        Learn Hub
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <Card className="border-2 border-green-200">
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                    <p className="text-muted-foreground mb-6">
                      Thanks for getting in touch. We'll respond within 1-2 business days.
                    </p>
                    <Button variant="outline" onClick={resetForm}>
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Smith"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@company.co.uk"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your Company Ltd"
                          value={formData.businessName}
                          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">What's this about? *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTACT_SUBJECTS.map((subject) => (
                              <SelectItem key={subject.value} value={subject.value}>
                                {subject.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={6}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>

                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">Is Carbon Path free to use?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! The Learn Hub, grants directory, and assessment are completely free. You only pay if you choose to engage with a consultant directly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">How do I become a listed consultant?</h3>
                  <p className="text-muted-foreground text-sm">
                    We vet all consultants before listing them. Use the contact form above and select "Becoming a Consultant" to start the conversation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">Do you provide financial or legal advice?</h3>
                  <p className="text-muted-foreground text-sm">
                    No. Carbon Path provides general guidance and information only. For financial, tax, or legal advice, please consult a qualified professional.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold mb-2">Is my data secure?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes. We take data security seriously. Assessment responses are stored securely and used only to provide you with relevant recommendations. See our Privacy Policy for details.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
