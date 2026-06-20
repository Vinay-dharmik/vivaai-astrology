/**
 * Login page layout — strips the admin sidebar for a clean login experience.
 * Still inherits the admin's SessionProvider.
 */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override admin sidebar visibility on login page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-shell > aside,
        .admin-shell > div.hidden { display: none !important; }
        .admin-shell > main { margin-left: 0 !important; }
      `}} />
      {children}
    </>
  );
}
