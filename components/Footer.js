import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">SRE Community Australia</div>
      <div className="footer-links">
        <Link href="/#about">about</Link>
        <Link href="/#events">events</Link>
        <Link href="/#videos">resources</Link>
        <Link href="/survey">state-of-sre</Link>
        <Link href="/resume">resume-guide</Link>
        <a href="mailto:hello@sreaustralia.com">contact</a>
      </div>
      <div className="footer-copy">&copy; 2025 SRE Community Australia. Made with ❤️ by the community.</div>

      <style jsx>{`
        footer {
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 32px 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .footer-logo {
          color: var(--green);
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        .footer-logo::before {
          content: '> ';
          color: var(--green-dim);
        }
        .footer-links {
          display: flex;
          gap: 24px;
        }
        .footer-links a,
        .footer-links :global(a) {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.5px;
          transition: color 0.15s;
        }
        .footer-links a:hover,
        .footer-links :global(a:hover) {
          color: var(--green);
        }
        .footer-copy {
          font-size: 11px;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          footer {
            padding: 28px 24px;
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
