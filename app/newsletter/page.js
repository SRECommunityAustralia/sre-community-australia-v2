'use client';

export default function NewsletterPage() {
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <div className="subpage-hero-inner">
          <div className="subpage-eyebrow">Stay Connected</div>
          <h1>SRE dispatches, straight to <span>your inbox.</span></h1>
          <p>Event announcements, talk recaps, community news, and the occasional link worth reading.</p>
        </div>
      </section>

      <section className="subpage-content">
        <div className="newsletter-card">
          <div className="terminal-titlebar">
            <div className="term-dot red"></div>
            <div className="term-dot yellow"></div>
            <div className="term-dot green"></div>
            <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>subscribe.sh</span>
          </div>
          <div className="newsletter-body">
            <h2>Get the signal, not the noise.</h2>
            <p>We only email when there is something worth reading. No spam, no fluff, no vendor pitches.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="you@company.com" />
              <button className="btn-primary" style={{ clipPath: 'none' }}>subscribe →</button>
            </div>
            <div className="newsletter-note">// No spam, ever. Unsubscribe any time.</div>
          </div>
        </div>

        <div className="newsletter-what">
          <div className="what-label">// What you will receive</div>
          <div className="what-items">
            <div className="what-item">
              <div className="what-icon">📅</div>
              <div><strong>Event announcements</strong><br />New meetups in Melbourne, Sydney, and beyond.</div>
            </div>
            <div className="what-item">
              <div className="what-icon">📝</div>
              <div><strong>Talk recaps</strong><br />Key takeaways from past sessions and panels.</div>
            </div>
            <div className="what-item">
              <div className="what-icon">📊</div>
              <div><strong>Community data</strong><br />State of SRE report highlights and updates.</div>
            </div>
          </div>
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
        .subpage-content { max-width: 640px; margin: 0 auto; padding: 64px 80px 96px; }
        .newsletter-card {
          background: var(--bg2); border: 1px solid var(--border); overflow: hidden; margin-bottom: 48px;
        }
        .newsletter-body { padding: 32px; }
        .newsletter-body h2 {
          font-family: var(--font-display); font-size: 24px; font-weight: 800;
          color: var(--white); margin-bottom: 12px;
        }
        .newsletter-body p {
          font-size: 13px; color: var(--text-dim); line-height: 1.7; margin-bottom: 24px;
        }
        .newsletter-form { display: flex; gap: 0; }
        .newsletter-form input {
          flex: 1; padding: 12px 16px;
          background: var(--bg); border: 1px solid var(--border); border-right: none;
          font-family: var(--font-mono); font-size: 13px; color: var(--white);
          outline: none;
        }
        .newsletter-form input:focus { border-color: var(--green-dim); }
        .newsletter-form input::placeholder { color: var(--text-muted); }
        .newsletter-note {
          font-size: 11px; color: var(--text-muted); margin-top: 12px;
        }
        .newsletter-what { }
        .what-label {
          font-size: 11px; color: var(--text-muted); letter-spacing: 1px;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .what-items { display: flex; flex-direction: column; gap: 16px; }
        .what-item {
          display: flex; gap: 16px; padding: 16px 20px;
          background: var(--bg2); border: 1px solid var(--border);
          border-left: 2px solid var(--green-dim); font-size: 13px; color: var(--text-dim);
          line-height: 1.6;
        }
        .what-item strong { color: var(--white); font-weight: 500; }
        .what-icon { font-size: 18px; flex-shrink: 0; }
        @media (max-width: 900px) {
          .subpage-hero { padding: 60px 24px; }
          .subpage-content { padding: 48px 24px; }
        }
      `}</style>
    </div>
  );
}
