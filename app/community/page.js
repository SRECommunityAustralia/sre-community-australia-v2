'use client';

const socials = [
  { href: 'https://www.meetup.com/melbourne-sre-meetup/', icon: '📅', name: 'Meetup Melbourne', handle: 'melbourne-sre-meetup' },
  { href: 'https://www.meetup.com/sydney-sre-meetup/', icon: '📅', name: 'Meetup Sydney', handle: 'sydney-sre-meetup' },
  { href: 'https://www.linkedin.com/company/sre-australia-meetup', icon: '💼', name: 'LinkedIn', handle: 'SRE Community Australia' },
  { href: 'https://twitter.com', icon: '𝕏', name: 'Twitter / X', handle: '@SRECommunityAU' },
  { href: 'https://join.slack.com/t/sreaustralia/shared_invite/zt-3srk0q8cz-ofvBqWFDIXxDpguT1n6n3w', icon: '💬', name: 'Slack', handle: 'sre-community-au.slack.com' },
  { href: 'https://youtube.com', icon: '▶️', name: 'YouTube', handle: 'SRE Community AU' },
];

export default function CommunityPage() {
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <div className="subpage-hero-inner">
          <div className="subpage-eyebrow">Find Us</div>
          <h1>Join the <span>conversation.</span></h1>
          <p>We are active across these platforms. Come say hi, share what you are working on, or just lurk.</p>
        </div>
      </section>

      <section className="subpage-content">
        <div className="social-grid">
          {socials.map((s) => (
            <a href={s.href} target="_blank" rel="noopener" className="social-card" key={s.name}>
              <div className="social-icon">{s.icon}</div>
              <div className="social-name">{s.name}</div>
              <div className="social-handle">{s.handle}</div>
              <div className="social-arrow">{s.name}</div>
            </a>
          ))}
        </div>
      </section>

      <style jsx>{`
        .subpage { padding-top: 56px; min-height: 100vh; }
        .subpage-hero {
          padding: 80px 80px 60px; border-bottom: 1px solid var(--border); background: var(--bg);
        }
        .subpage-hero-inner { max-width: 1100px; margin: 0 auto; }
        .subpage-eyebrow {
          font-size: 11px; color: var(--green); letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .subpage-hero h1 {
          font-family: var(--font-display); font-size: clamp(36px, 5vw, 56px); font-weight: 800;
          letter-spacing: -2px; line-height: 1.05; color: var(--white); margin-bottom: 16px;
        }
        .subpage-hero h1 span { color: var(--green); }
        .subpage-hero p { font-size: 14px; color: var(--text-dim); line-height: 1.7; max-width: 560px; }
        .subpage-content { max-width: 900px; margin: 0 auto; padding: 64px 80px 96px; }
        .social-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px; background: var(--border); border: 1px solid var(--border);
        }
        .social-card {
          background: var(--bg2); text-decoration: none; color: var(--text);
          display: flex; flex-direction: column; gap: 8px; padding: 24px 20px;
          transition: background 0.15s;
        }
        .social-card:hover { background: var(--surface); }
        .social-icon { font-size: 20px; }
        .social-name { font-weight: 700; font-size: 13px; color: var(--white); }
        .social-handle { font-size: 11px; color: var(--text-muted); }
        .social-arrow { margin-top: auto; font-size: 12px; color: var(--green); }
        .social-arrow::before { content: '$ open '; color: var(--green-dim); }
        @media (max-width: 900px) {
          .subpage-hero { padding: 60px 24px; }
          .subpage-content { padding: 48px 24px; }
        }
      `}</style>
    </div>
  );
}