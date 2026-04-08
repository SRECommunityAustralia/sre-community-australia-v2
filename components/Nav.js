'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/#about', label: 'about' },
    { href: '/#events', label: 'events' },
    { href: '/#videos', label: 'resources' },
    { href: '/survey', label: 'state-of-sre' },
    { href: '/#sponsors', label: 'sponsors' },
    { href: '/resume', label: 'resume-guide' },
  ];

  return (
    <nav>
      <Link href="/" className="nav-logo">
        <div className="nav-logo-mark">SRE</div>
        <span className="nav-logo-text">SRE Community Australia</span>
      </Link>
      <ul className="nav-links">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/survey" className="nav-cta">
        contribute-data
      </Link>

      <style jsx>{`
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(13,15,14,0.96);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border);
          padding: 0 40px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--white);
        }
        .nav-logo-mark {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--green);
          border: 1px solid var(--green-dim);
          padding: 4px 7px;
          letter-spacing: 1px;
        }
        .nav-logo-mark::before {
          content: '> ';
          color: var(--green-dim);
        }
        .nav-logo-text {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: 0.5px;
        }
        .nav-links {
          display: flex;
          gap: 0;
          list-style: none;
        }
        .nav-links li a {
          text-decoration: none;
          color: var(--text-dim);
          font-size: 12px;
          letter-spacing: 0.5px;
          padding: 0 16px;
          height: 56px;
          display: flex;
          align-items: center;
          border-right: 1px solid var(--border);
          transition: all 0.15s;
        }
        .nav-links li:first-child a {
          border-left: 1px solid var(--border);
        }
        .nav-links li a::before {
          content: './';
          color: var(--text-muted);
          margin-right: 3px;
        }
        .nav-links li a:hover,
        .nav-links li a.active {
          color: var(--green);
          background: var(--green-glow);
        }
        .nav-cta {
          background: transparent;
          color: var(--green);
          border: 1px solid var(--green-dim);
          padding: 8px 18px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: all 0.15s;
        }
        .nav-cta::before {
          content: '$ ';
          color: var(--green-dim);
        }
        .nav-cta:hover {
          background: var(--green-glow);
          border-color: var(--green);
          box-shadow: 0 0 12px rgba(57,255,138,0.15);
        }

        @media (max-width: 900px) {
          nav { padding: 0 20px; }
          .nav-links { display: none; }
        }
      `}</style>
    </nav>
  );
}
