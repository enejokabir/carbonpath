import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function Terms() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sage-light/20">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-mint-fresh/5" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl prose prose-slate">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using Carbon Path, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
            </p>
            <p className="text-muted-foreground">
              These terms apply to all visitors, users, and others who access or use our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Carbon Path is an information platform designed to help UK SMEs understand and navigate their sustainability journey. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Educational content about Net Zero and sustainability</li>
              <li>Information about grants, funding, and tax incentives</li>
              <li>A directory of sustainability consultants</li>
              <li>Self-assessment tools to understand your business needs</li>
              <li>Introduction facilitation between SMEs and consultants</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">3. Important Disclaimers</h2>

            <h3 className="text-lg font-semibold mb-3 mt-6">Information Only</h3>
            <p className="text-muted-foreground mb-4">
              Carbon Path provides information and guidance for general educational purposes. We are not professional advisors. The information on our platform should not be considered as professional financial, legal, or technical advice.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-6">Grant and Funding Information</h3>
            <p className="text-muted-foreground mb-4">
              While we strive to keep grant and funding information up to date, eligibility criteria, deadlines, and availability may change. We do not guarantee the accuracy of grant information or your eligibility for any funding. Always verify details with the funding body directly.
            </p>

            <h3 className="text-lg font-semibold mb-3 mt-6">Consultant Directory</h3>
            <p className="text-muted-foreground mb-4">
              Consultants listed on our platform are independent professionals. Carbon Path:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Does not endorse or guarantee any consultant's services</li>
              <li>Is not responsible for the quality, outcome, or cost of their services</li>
              <li>Does not act as an intermediary in any service agreement</li>
              <li>Simply facilitates introductions at your request</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Any engagement with a consultant is directly between you and them. Please conduct your own due diligence before engaging any consultant's services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms or are inactive for extended periods.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Use our services for any unlawful purpose</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to access other users' accounts</li>
              <li>Interfere with or disrupt our services</li>
              <li>Scrape, copy, or harvest data from our platform without permission</li>
              <li>Use automated systems to access our services without authorisation</li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The Carbon Path platform, including its design, content, and features, is owned by Carbon Path and protected by intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You may use our content for personal, non-commercial purposes related to your business's sustainability journey. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the fullest extent permitted by law, Carbon Path shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Decisions made based on information from our platform</li>
              <li>Actions or services of consultants listed on our platform</li>
              <li>Grant application outcomes or funding decisions</li>
              <li>Service interruptions or technical issues</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Our total liability shall not exceed the amount you paid us (if any) in the past 12 months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">8. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Carbon Path, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of significant changes by posting the updated terms on this page. Your continued use of Carbon Path after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these terms. Upon termination, your right to use our services will immediately cease.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">
                Carbon Path<br />
                Email: legal@carbonpath.uk<br />
                East Midlands, UK
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
