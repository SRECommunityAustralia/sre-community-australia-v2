'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './home.css';

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase(),
  };
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [eventsSource, setEventsSource] = useState('loading');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setEventsSource(data.source || 'fallback');
      })
      .catch(() => setEventsSource('error'));
  }, []);
  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-grid-bg"></div>
        <div className="hero-scanline"></div>
        <div className="hero-content">
          <div className="hero-prompt fade-in">
            <span className="prompt-path">sre-community-au ~ $</span>
            <span className="prompt-cursor"></span>
          </div>
          <h1 className="hero-title fade-in">
            Where <span className="hl">reliability</span><br />
            <span className="dim">engineers</span> connect.
          </h1>
          <p className="hero-subtitle fade-in">
            A practitioner-led community for SREs, platform engineers, and infrastructure folks across Australia. Share knowledge, shape the craft, build what lasts.
          </p>
          <div className="hero-actions fade-in">
            <a href="https://www.meetup.com/melbourne-sre-meetup/" target="_blank" rel="noopener" className="btn-primary">Join on Meetup Melbourne →</a>
            <a href="https://www.meetup.com/sydney-sre-meetup/" target="_blank" rel="noopener" className="btn-primary-alt">Join on Meetup Sydney →</a>
            <a href="#events" className="btn-secondary">📅 upcoming events</a>
          </div>
          <div className="hero-stats fade-in">
            <div className="stat"><div className="stat-num">800+</div><div className="stat-label">// community members</div></div>
            <div className="stat"><div className="stat-num">20+</div><div className="stat-label">// meetups held</div></div>
            <div className="stat"><div className="stat-num">6</div><div className="stat-label">// cities represented</div></div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <div className="about-text">
            <div className="section-label">About Us</div>
            <h2 className="section-title">Built by practitioners,<br />for practitioners.</h2>
            <p>SRE Community Australia is an independent, volunteer-run group dedicated to advancing the discipline of Site Reliability Engineering across the Australian tech landscape.</p>
            <p>We run regular meetups in Melbourne, Sydney, Brisbane, and beyond, bringing together engineers working on reliability, scalability, observability, and platform engineering at every scale.</p>
            <div className="about-pillars">
              <div className="pillar">
                <div className="pillar-icon">🔧</div>
                <div><div className="pillar-title">Real Talk, No Vendor Fluff</div><div className="pillar-desc">Practitioner-led sessions focused on real problems and hard-won lessons.</div></div>
              </div>
              <div className="pillar">
                <div className="pillar-icon">🌏</div>
                <div><div className="pillar-title">Pan-Australian Network</div><div className="pillar-desc">Connecting reliability engineers across major Australian cities and remote teams.</div></div>
              </div>
              <div className="pillar">
                <div className="pillar-icon">📖</div>
                <div><div className="pillar-title">Open Knowledge Sharing</div><div className="pillar-desc">Talks, workshops, and resources available to the whole community.</div></div>
              </div>
            </div>
          </div>
          <div className="terminal-block">
            <div className="terminal-titlebar">
              <div className="term-dot red"></div>
              <div className="term-dot yellow"></div>
              <div className="term-dot green"></div>
              <span className="terminal-title">community-stats.sh</span>
            </div>
            <div className="terminal-body">
              <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd">./get-stats --community au-sre</span></div>
              <div className="t-output"><span className="t-comment"># Fetching community data...</span></div>
              <div className="t-output"><span className="t-key">next_meetup</span>: <span className="t-val">Melbourne</span></div>
              <div className="t-output"><span className="t-key">new_members_ytd</span>: <span className="t-val">+147</span></div>
              <div className="t-output"><span className="t-key">topics_covered</span>: <span className="t-val">[&quot;SLOs&quot;,&quot;AI&quot;,&quot;Observability&quot;]</span></div>
              <div className="t-output"><span className="t-key">community_vibe</span>: <span className="t-val">&quot;inclusive&quot;</span></div>
              <div className="t-output"><span className="t-key">total_members</span>: <span className="t-val">800+</span></div>
              <div className="t-output"><span className="t-key">cities</span>: <span className="t-val">[&quot;MEL&quot;,&quot;SYD&quot;,&quot;BNE&quot;,&quot;PER&quot;,&quot;ADL&quot;,&quot;CBR&quot;]</span></div>
              <div className="t-line" style={{marginTop:'8px'}}><span className="t-prompt">$</span><span className="t-cmd" style={{color:'var(--green)'}}>✓ done</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="events-section">
        <div className="section-header">
          <div className="section-header-text">
            <div className="section-label">Events</div>
            <h2 className="section-title">Upcoming Meetups</h2>
            <p className="section-subtitle">Join us in person or online. All experience levels welcome.</p>
          </div>
          <a href="https://www.meetup.com/melbourne-sre-meetup/" target="_blank" rel="noopener" className="btn-secondary">view all on Meetup →</a>
        </div>

        {eventsSource === 'loading' && (
          <div className="events-loading">
            <span className="t-comment">// fetching events from meetup...</span>
          </div>
        )}

        {eventsSource === 'error' && (
          <div className="events-loading">
            <span className="t-comment">// could not load events. Check Meetup directly.</span>
          </div>
        )}

        {events.length > 0 && (
          <div className="events-grid">
            {events.map((event) => {
              const date = formatEventDate(event.dateTime);
              const isSyd = event.badge === 'Sydney';
              const isOnline = event.eventType === 'ONLINE';
              const meetupUrl = event.url || `https://www.meetup.com/${event.groupUrlname}/`;
              return (
                <a href={meetupUrl} target="_blank" rel="noopener" className="event-card" key={event.id}>
                  <div className="event-card-top">
                    <div>
                      <div className={`event-date-num ${isSyd ? 'syd-num' : ''}`}>{date.day}</div>
                      <div className="event-date-month">{date.month}</div>
                    </div>
                    <span className={`event-badge ${isSyd ? 'syd' : isOnline ? 'online' : 'melb'}`}>
                      {event.badge || (isOnline ? 'Online' : 'Melbourne')}
                    </span>
                  </div>
                  <div className="event-card-body">
                    <div className="event-type">
                      Meetup · {isOnline ? 'Virtual' : 'In Person'}
                    </div>
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      <span>🕕 {date.time}</span>
                      {event.venue && <span>📍 {event.venue}</span>}
                    </div>
                  </div>
                  <div className="event-card-footer">
                    <span style={{fontSize:'11px',color:'var(--text-muted)'}}>
                      {event.going ? `${event.going} RSVPs` : 'Coming soon'}
                    </span>
                    <span className="event-rsvp" style={isSyd ? {color:'var(--amber)'} : {}}>
                      RSVP on Meetup {event.badge || 'Melbourne'}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {eventsSource !== 'loading' && events.length === 0 && eventsSource !== 'error' && (
          <div className="events-loading">
            <span className="t-comment">// no upcoming events scheduled. Check back soon.</span>
          </div>
        )}

        <div className="meetup-banner">
          <div className="meetup-banner-text"><strong>Stay up to date.</strong> All events are managed through our Meetup groups. Follow us so you never miss a session.</div>
          <div className="meetup-banner-btns">
            <a href="https://www.meetup.com/melbourne-sre-meetup/" target="_blank" rel="noopener" className="btn-primary">Join on Meetup Melbourne →</a>
            <a href="https://www.meetup.com/sydney-sre-meetup/" target="_blank" rel="noopener" className="btn-primary-alt">Join on Meetup Sydney →</a>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="videos" className="resources-section">
        <div className="section-header">
          <div className="section-header-text">
            <div className="section-label">Resources</div>
            <h2 className="section-title">Talks, Guides & Sessions</h2>
            <p className="section-subtitle">Catch up on past talks, workshops, and community resources.</p>
          </div>
        </div>
        <div className="video-grid">
          <div className="video-card">
            <div className="video-card-header">
              <div className="video-card-header-top">
                <span className="video-tag">Meetup Recap · Melbourne</span>
                <span className="video-date">26 Feb 2026</span>
              </div>
              <div className="video-card-title">SRE vs Platform Engineering</div>
              <div className="video-card-subtitle">Who actually owns what?</div>
              <div className="video-card-desc">
                7 key takeaways from a panel of practitioners at Netwealth, covering ownership models, observability pipelines, platform adoption, and how incidents create funding momentum.
              </div>
              <div className="panelists">
                <div className="panelist-label"># panelists</div>
                <div className="panelist">Rayna Tsimitakopoulos <span>· Head of Dev Experience, Netwealth</span></div>
                <div className="panelist">Yann Vigara <span>· Principal Engineer, Operata</span></div>
                <div className="panelist">Tony Mamacos <span>· Principal Member of Technical Staff, Oracle</span></div>
                <div className="panelist">Shaun O'Keefe <span>· Principal Consultant, Aomodori</span></div>
                <div className="panelist">Parveen Bhardwaj <span>· Staff SRE, SEER</span></div>
              </div>
            </div>
            <div className="video-embed-wrap">
              <div className="video-embed">
                <iframe
                  loading="lazy"
                  src="https://www.canva.com/design/DAHDsBCkVGI/DjP0MxYXbdUzt-q3-ObweQ/view?embed"
                  allowFullScreen
                  allow="fullscreen"
                ></iframe>
              </div>
              <div className="video-embed-footer">
                <a href="https://www.canva.com/design/DAHDsBCkVGI/DjP0MxYXbdUzt-q3-ObweQ/view" target="_blank" rel="noopener">$ open-fullscreen →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATE OF SRE */}
      <section id="state-of-sre" className="sre-section">
        <div className="salary-grid">
          <div>
            <div className="section-label">Community Report</div>
            <h2 className="section-title">State of SRE Australia</h2>
            <p className="section-subtitle">Help us build the most comprehensive report on the state of Site Reliability Engineering across Australia and New Zealand.</p>
            <div className="salary-features">
              <div className="salary-feature"><div className="salary-feature-icon">🔒</div><div><div className="salary-feature-title">Anonymous & Private</div><div className="salary-feature-desc">No personally identifiable information collected.</div></div></div>
              <div className="salary-feature"><div className="salary-feature-icon">📊</div><div><div className="salary-feature-title">Results Shared with Community</div><div className="salary-feature-desc">Aggregated data published openly to all members.</div></div></div>
              <div className="salary-feature"><div className="salary-feature-icon">⚡</div><div><div className="salary-feature-title">Takes ~3 Minutes</div><div className="salary-feature-desc">Role, level, location, comp, and tech stack.</div></div></div>
            </div>
          </div>
          <div className="salary-cta-box">
            <div className="salary-cta-top">
              <div className="term-dot red"></div>
              <div className="term-dot yellow"></div>
              <div className="term-dot green"></div>
              <span className="terminal-title">state-of-sre-2025.sh</span>
            </div>
            <div className="salary-cta-body">
              <h3>What&apos;s the <span>state of SRE</span><br />in Australia?</h3>
              <p>162 engineers have already contributed. Add your voice and get access to the full anonymised results.</p>
              <Link href="/survey" className="btn-primary">$ contribute to the report →</Link>
              <div className="salary-cta-note">Results updated quarterly · All experience levels welcome</div>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="sponsors-section">
        <div className="section-label">Sponsors & Partners</div>
        <h2 className="section-title">Supported by great companies.</h2>
        <p className="section-subtitle">Our sponsors make free, high-quality events possible for the whole community.</p>
        <div className="sponsors-tier">
          <div className="tier-label">Platinum Partners</div>
          <div className="sponsors-row">
            <a href="#" className="sponsor-card">Your Sponsor</a>
            <a href="#" className="sponsor-card">Your Sponsor</a>
            <div className="sponsor-card add">+ add sponsor</div>
          </div>
        </div>
        <div className="sponsors-tier">
          <div className="tier-label">Community Supporters</div>
          <div className="sponsors-row">
            <a href="#" className="sponsor-card">Supporter</a>
            <a href="#" className="sponsor-card">Supporter</a>
            <a href="#" className="sponsor-card">Supporter</a>
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

      {/* NEWSLETTER */}
      <section id="newsletter" className="newsletter-section">
        <div className="newsletter-inner">
          <div className="section-label">Stay Connected</div>
          <h2 className="section-title">SRE dispatches, straight to your inbox.</h2>
          <p className="section-subtitle">Event announcements, talk recaps, community news, and the occasional link worth reading.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn-primary" style={{clipPath:'none'}}>subscribe →</button>
          </div>
          <div className="newsletter-note">No spam, ever. Unsubscribe any time.</div>
        </div>
      </section>

      {/* SOCIALS */}
      <section id="social" className="social-section">
        <div className="section-label">Find Us</div>
        <h2 className="section-title">Join the conversation.</h2>
        <p className="section-subtitle">We&apos;re active across these platforms, come say hi.</p>
        <div className="social-grid">
          {[
            { href: 'https://www.meetup.com/melbourne-sre-meetup/', icon: '📅', name: 'Meetup Melbourne', handle: 'melbourne-sre-meetup' },
            { href: 'https://www.meetup.com/sydney-sre-meetup/', icon: '📅', name: 'Meetup Sydney', handle: 'sydney-sre-meetup' },
            { href: 'https://www.linkedin.com/company/sre-australia-meetup', icon: '💼', name: 'LinkedIn', handle: 'SRE Community Australia' },
            { href: 'https://twitter.com', icon: '𝕏', name: 'Twitter / X', handle: '@SRECommunityAU' },
            { href: 'https://join.slack.com/t/sreaustralia/shared_invite/zt-3srk0q8cz-ofvBqWFDIXxDpguT1n6n3w', icon: '💬', name: 'Slack', handle: 'sre-community-au.slack.com' },
            { href: 'https://youtube.com', icon: '▶️', name: 'YouTube', handle: 'SRE Community AU' },
          ].map((s) => (
            <a href={s.href} target="_blank" rel="noopener" className="social-card" key={s.name}>
              <div className="social-icon">{s.icon}</div>
              <div className="social-name">{s.name}</div>
              <div className="social-handle">{s.handle}</div>
              <div className="social-arrow">{s.name}</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}