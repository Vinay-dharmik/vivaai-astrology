export default function NotFound() {
  return (
    <div className="section-container py-20 text-center">
      <div className="text-6xl mb-4">🔮</div>
      <h1 className="font-sora font-bold text-3xl gold-text mb-3">Page Not Found</h1>
      <p className="text-[var(--text-muted)] mb-8">
        The stars couldn&apos;t locate this page. Let us guide you back.
      </p>
      <a href="/" className="gold-btn inline-block px-6 py-3">Return Home</a>
    </div>
  );
}
