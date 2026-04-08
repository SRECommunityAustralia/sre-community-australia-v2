'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-logo">SRE Community Australia</div>
      <div className="footer-links">
        <Link href="/#about">about</Link>
        <Link href="/#events">events</Link>
        <Link href="/#videos">resources</Link>
        <Link href="/survey">state-of-sre</Link>
        <Link href="/resume">resume-guide</Link>
        <a href="mailto:hello@sreaustralia.com">contact</a>
      </div>
      <div className="footer-copy">&copy; 2025 SRE Community Australia.</div>
    </footer>
  );
}