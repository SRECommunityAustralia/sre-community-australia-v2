'use client';

export default function SponsorsPage() {
  return (
    <div className="subpage">
      <section className="subpage-hero">
        <div className="subpage-hero-inner">
          <div className="subpage-eyebrow">Sponsors & Partners</div>
          <h1>Supported by <span>great companies.</span></h1>
          <p>Our sponsors make free, high-quality events possible for the whole community.</p>
        </div>
      </section>

      <section className="subpage-content">
        <div className="sponsors-tier">
          <div className="tier-label">Platinum Partners</div>
          <div className="sponsors-row">
            <div className="sponsor-card">Your Sponsor</div>
            <div className="sponsor-card">Your Sponsor</div>
            <div className="sponsor-card add">+ add sponsor</div>
          </div>
        </div>

        <div className="sponsors-tier">
          <div className="tier-label">Community Supporters</div>
          <div className="sponsors-row">
            <div className="sponsor-card">Supporter</div>
            <div className="sponsor-card">Supporter</div>
            <div className="sponsor-card">Supporter</div>
            <div className="sponsor-card add">+ add sponsor</div>
          </div>
        </div>

        <div className="become-sponsor">
          <div>
            <h3>Interested in sponsoring?</h3>
            <p>Support Australia&apos;s SRE community and connect with senior engineers across the country.</p>
          </div>
          <a href="mailto:hello@sreaustralia.com" className="btn-primary">$ get in touch →</a>
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
        .sponsors-tier { margin-bottom: 40px; }
        .tier-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: 16px; padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .tier-label::before { content: '# '; }
        .sponsors-row {
          display: flex; flex-wrap: wrap; gap: 1px; background: var(--border);
          border: 1px solid var(--border);
        }
        .sponsor-card {
          background: var(--bg2); padding: 20px 32px;
          display: flex; align-items: center; justify-content: center;
          min-width: 160px; height: 72px; color: var(--text-dim); font-size: 13px;
          transition: all 0.15s; flex: 1;
        }
        .sponsor-card:hover { background: var(--surface); color: var(--green); }
        .sponsor-card.add {
          color: var(--text-muted); font-size: 11px; letter-spacing: 0.5px;
          border: 1px dashed var(--border2); background: transparent;
        }
        .become-sponsor {
          margin-top: 24px; padding: 24px 28px; background: var(--surface);
          border: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          gap: 24px; flex-wrap: wrap;
        }
        .become-sponsor h3 { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
        .become-sponsor p { font-size: 12px; color: var(--text-dim); }
        @media (max-width: 900px) {
          .subpage-hero { padding: 60px 24px; }
          .subpage-content { padding: 48px 24px; }
        }
      `}</style>
    </div>
  );
}