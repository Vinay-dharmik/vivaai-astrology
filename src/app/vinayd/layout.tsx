import { AdminProviders } from "./providers";
import { AdminSidebar } from "./AdminSidebar";

/**
 * Admin Layout — wraps all /vinayd/* routes.
 * Overrides the root layout's body content entirely.
 * Hides Navbar, Footer, StarBackground, StickyBottomCTA for admin pages.
 * robots: noindex is set via metadata in the page-level to prevent indexing.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      {/* Hide root layout components */}
      <style dangerouslySetInnerHTML={{ __html: `
        body > nav, 
        body > footer,
        body > .star-background,
        body > .sticky-bottom-cta,
        body > .cookie-consent,
        body > .adsense-script,
        header, 
        [class*="StarBackground"],
        [class*="StickyBottom"],
        [class*="CookieConsent"] { display: none !important; }
        body > main { padding-top: 0 !important; }
      `}} />
      <div className="min-h-screen flex" style={{ background: "#0a0a14" }}>
        <AdminSidebar />
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminProviders>
  );
}
