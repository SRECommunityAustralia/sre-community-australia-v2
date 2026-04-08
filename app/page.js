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
            <div className="stat">
              <div className="stat-num">2000+</div>
              <div className="stat-label">// community members</div>
            </div>
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
              <div className="t-output"><span className="t-key">total_members</span>: <span className="t-val">2000+</span></div>
              <div className="t-output"><span className="t-key">cities</span>: <span className="t-val">[&quot;MEL&quot;,&quot;SYD&quot;,&quot;BNE&quot;,&quot;PER&quot;,&quot;ADL&quot;,&quot;CBR&quot;]</span></div>
              <div className="t-output"><span className="t-key">topics_covered</span>: <span className="t-val">[&quot;SLOs&quot;,&quot;AI&quot;,&quot;Observability&quot;]</span></div>
              <div className="t-output"><span className="t-key">community_vibe</span>: <span className="t-val">&quot;inclusive&quot;</span></div>
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
    </>
  );
}