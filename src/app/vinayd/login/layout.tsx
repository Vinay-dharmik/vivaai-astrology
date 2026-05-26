/**
 * Login page layout — strips the admin sidebar for a clean login experience.
 * Still inherits the admin's SessionProvider.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override admin sidebar visibility on login page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .min-h-screen.flex > aside,
        .min-h-screen.flex > div:first-child { display: none !important; }
        .min-h-screen.flex > main { margin-left: 0 !important; }
      `}} />
      {children}
    </>
  );
}
