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
    <nav className="site-nav">
      <Link href="/" className="site-nav-logo">
        <div className="site-nav-logo-mark">SRE</div>
        <span className="site-nav-logo-text">SRE Community Australia</span>
      </Link>
      <ul className="site-nav-links">
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
      <Link href="/survey" className="site-nav-cta">
        contribute-data
      </Link>
    </nav>
  );
}