'use client';

import { useEffect } from 'react';

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'structure', label: 'The right structure' },
  { id: 'star', label: 'The STAR method' },
  { id: 'principles', label: 'SRE principles' },
  { id: 'practices', label: 'SRE practices' },
  { id: 'monitoring', label: 'Monitoring example' },
  { id: 'incidents', label: 'Incidents on your resume' },
];

const principles = ['Embracing risk', 'SLOs', 'Eliminating toil', 'Monitoring', 'Automation', 'Release engineering', 'Simplicity'];

const practices = [
  'Practical alerting', 'On-call', 'Troubleshooting', 'Emergency response', 'Incident management',
  'Postmortem culture', 'Outage tracking', 'Testing for reliability', 'Software engineering in SRE',
  'Load balancing', 'Handling overload', 'Cascading failure mitigation', 'Managing critical state',
  'Distributed scheduling', 'Data processing pipelines', 'Data integrity', 'Reliable product launches',
];

export default function ResumePage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) el.target.classList.add('visible');
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.article-section').forEach(el => observer.observe(el));

    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    document.querySelectorAll('.article-section').forEach(s => tocObserver.observe(s));

    return () => { observer.disconnect(); tocObserver.disconnect(); };
  }, []);

  return (
    <div className="resume-page">
      {/* Hero */}
      <section className="resume-hero">
        <div className="resume-hero-inner">
          <div className="resume-eyebrow">Career Resources</div>
          <h1>Writing your resume for<br />an <span>SRE role.</span></h1>
          <p>A practical guide from someone who has recruited in the Australian SRE market. How to structure your experience, frame your impact, and stand out in a competitive field.</p>
        </div>
      </section>

      {/* Content */}
      <div className="resume-layout">
        <aside className="resume-toc">
          <div className="toc-label"># on this page</div>
          <ul className="toc-list">
            {sections.map(s => (
              <li key={s.id}><a href={`#${s.id}`} className="toc-link">{s.label}</a></li>
            ))}
          </ul>
        </aside>

        <article className="resume-article">
          {/* Intro */}
          <div className="article-section" id="intro">
            <div className="section-tag">// Introduction</div>
            <h2>SRE in Australia is broader than most engineers realise.</h2>
            <p>Since recruiting in the Australian infrastructure market across Cloud Engineering, DevOps and Site Reliability Engineering, one thing stands out: <strong>SRE in Australia is something a lot of engineers take part in without necessarily being in a dedicated role.</strong></p>
            <p>Businesses from startup to enterprise are now implementing reliability practices and seeing the value they can add. Observability is a hot talking point in the current market, with multiple businesses hiring engineers with observability-focused titles. But Site Reliability is much broader than this, while Observability is a core pillar, it is key to look at the full scope of the role.</p>
            <p>Not all SRE roles are the same, and following the Google method is not always practical. The key is having <strong>multiple resume versions based on a core template</strong> of your skills. It helps hiring managers remove cognitive bias and makes you more relevant to each specific role.</p>
          </div>

          <div className="article-divider"></div>

          {/* Structure */}
          <div className="article-section" id="structure">
            <div className="section-tag">// Structure</div>
            <h2>The big thing most resumes miss.</h2>
            <p>It is easy to write something like &ldquo;automated infrastructure build using Terraform.&rdquo; But what does that actually tell a hiring manager about you? The answer is: not much. Good structure is what separates resumes that get interviews from ones that do not.</p>
            <p>For every responsibility or project on your resume, think about three things:</p>
            <div className="method-cards">
              <div className="method-card">
                <div className="method-letter">W</div>
                <h4>Why</h4>
                <p>What was the problem space? What were you solving and why did it matter?</p>
              </div>
              <div className="method-card">
                <div className="method-letter">H</div>
                <h4>How</h4>
                <p>What action did you take? What tools, methods or decisions were involved?</p>
              </div>
              <div className="method-card">
                <div className="method-letter">I</div>
                <h4>Impact</h4>
                <p>What was the outcome? What changed for your customers, engineers, or the business?</p>
              </div>
            </div>
            <p>This template gives hiring managers a genuine insight into the role you played, the projects and technology you worked with, and the outcome it had.</p>
          </div>

          <div className="article-divider"></div>

          {/* STAR */}
          <div className="article-section" id="star">
            <div className="section-tag">// The STAR method</div>
            <h2>Apply STAR thinking to everything you write.</h2>
            <p>The Why / How / Impact structure maps directly to the <strong>STAR method</strong> used in interviews: Situation, Task, Action, Result. If you write your resume bullets this way, you are already halfway prepared for behavioural interview questions.</p>
            <div className="callout bad">
              <p><strong>Bad:</strong> &ldquo;Automated infrastructure build using Terraform.&rdquo;</p>
            </div>
            <div className="callout good">
              <p><strong>Better:</strong> &ldquo;Our manual provisioning process was causing 3 to 4 hour delays on new service deployments. Designed and implemented a Terraform module library across three AWS accounts, reducing provisioning time to under 10 minutes and eliminating a category of configuration drift incidents.&rdquo;</p>
            </div>
            <p>The second version tells the hiring manager what the problem was, what you did about it, and what changed as a result.</p>
          </div>

          <div className="article-divider"></div>

          {/* Principles */}
          <div className="article-section" id="principles">
            <div className="section-tag">// SRE principles</div>
            <h2>Map your experience to the core SRE principles.</h2>
            <p>Start thinking about how your current and previous work maps to the foundational pillars of SRE. You do not need all of them, but showing depth in even two or three signals genuine SRE thinking.</p>
            <div className="pill-grid">
              {principles.map(p => <span key={p} className="pill accent">{p}</span>)}
            </div>
            <p>For each principle, ask yourself: have I done something in my current role that relates to this? Even if your title is not SRE, the work often is.</p>
          </div>

          <div className="article-divider"></div>

          {/* Practices */}
          <div className="article-section" id="practices">
            <div className="section-tag">// SRE practices</div>
            <h2>Look at the breadth of SRE practice areas.</h2>
            <p>Beyond the core principles, SRE encompasses a wide range of practices. Review this list and identify where you have genuine experience.</p>
            <div className="pill-grid">
              {practices.map(p => <span key={p} className="pill">{p}</span>)}
            </div>
          </div>

          <div className="article-divider"></div>

          {/* Monitoring */}
          <div className="article-section" id="monitoring">
            <div className="section-tag">// Example: monitoring</div>
            <h2>How to write about improving reliability.</h2>
            <p>A good framework when writing about monitoring, observability or reliability improvements is to think about the chain of change you drove:</p>
            <div className="example-block">
              <div className="example-header">Monitoring improvement formula</div>
              <div className="example-body">
                <span className="hl">Need</span> a new metric which is X,<br />
                this will <span className="hl">indicate</span> Y,<br />
                which enables driving <span className="hl">action</span> Z.
              </div>
            </div>
            <p>This framework, monitor, investigate, alert, propose uplift, shows you are thinking about observability as a system that drives action, not just a collection of dashboards.</p>
          </div>

          <div className="article-divider"></div>

          {/* Incidents */}
          <div className="article-section" id="incidents">
            <div className="section-tag">// Incidents</div>
            <h2>The thing nobody puts on their resume, but should.</h2>
            <div className="incident-card">
              <div className="incident-label">// Underused signal</div>
              <p>Mentioning incidents, service failures and how you handled incident response almost never shows up on SRE resumes. It should.</p>
            </div>
            <p>It is great that the services you look after have an uptime of 99.99%, but what about when they go down? For a hiring manager focused on SRE, this is one of the most powerful talking points. It demonstrates technical depth, mental resilience, and cultural alignment with blameless postmortem practices.</p>
            <p>Think about incidents you have been involved in. How did you detect it? What was your role in the response? How did the team learn from it? <strong>That story, told with structure, is more valuable than a list of tools.</strong></p>
            <div className="callout good">
              <p><strong>Example:</strong> &ldquo;Led incident response for a P1 outage affecting the payments service. Coordinated cross-team communication, drove root cause analysis and authored a postmortem that resulted in three reliability improvements being prioritised in the next quarter. MTTR reduced from 47 minutes to 12 minutes over the following six months.&rdquo;</p>
            </div>
            <p>That kind of bullet tells a hiring manager more about you as an SRE than any certification or tool list ever could.</p>
          </div>
        </article>
      </div>

      <style jsx>{`
        .resume-page { padding-top: 56px; min-height: 100vh; }

        .resume-hero {
          padding: 80px 80px 60px;
          border-bottom: 1px solid var(--border);
        }
        .resume-hero-inner { max-width: 1100px; margin: 0 auto; }
        .resume-eyebrow {
          font-size: 11px; color: var(--green); letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .resume-hero h1 {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 64px); font-weight: 800;
          letter-spacing: -2px; line-height: 1.05;
          color: var(--white); margin-bottom: 20px;
        }
        .resume-hero h1 span { color: var(--green); }
        .resume-hero p {
          font-size: 14px; color: var(--text-dim); line-height: 1.7;
          max-width: 600px;
        }

        .resume-layout {
          display: grid; grid-template-columns: 220px 1fr;
          gap: 64px; max-width: 1100px; margin: 0 auto;
          padding: 64px 80px 96px; align-items: start;
        }
        .resume-toc { position: sticky; top: 76px; }
        .toc-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px;
        }
        .toc-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .toc-list a, .toc-list :global(a) {
          font-size: 12px; color: var(--text-muted); text-decoration: none;
          padding: 6px 10px; display: block; border-left: 2px solid transparent;
          transition: all 0.15s;
        }
        .toc-list a:hover, .toc-list :global(a:hover) { color: var(--text); background: var(--bg2); }
        .toc-list :global(a.active) {
          color: var(--green); border-left-color: var(--green); background: var(--green-glow);
        }

        .resume-article { max-width: 680px; }

        .article-section {
          margin-bottom: 48px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        :global(.article-section.visible) { opacity: 1; transform: translateY(0); }

        .section-tag {
          font-size: 11px; color: var(--text-muted); letter-spacing: 1.5px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .article-section h2 {
          font-family: var(--font-display);
          font-size: clamp(22px, 2.5vw, 30px); font-weight: 800;
          letter-spacing: -0.5px; line-height: 1.2;
          color: var(--white); margin-bottom: 20px;
        }
        .article-section p {
          font-size: 13px; color: var(--text-dim); line-height: 1.8; margin-bottom: 16px;
        }
        .article-section p strong { color: var(--white); font-weight: 500; }

        .article-divider { height: 1px; background: var(--border); margin: 0 0 48px; }

        .callout {
          background: var(--bg2); border: 1px solid var(--border);
          border-left: 3px solid var(--green-dim);
          padding: 20px 24px; margin: 20px 0;
        }
        .callout.bad { border-left-color: var(--red); }
        .callout.good { border-left-color: var(--cyan); }
        .callout p { margin: 0; font-size: 13px; color: var(--text-dim); line-height: 1.7; }
        .callout p strong { color: var(--green); font-weight: 500; }
        .callout.bad p strong { color: var(--red); }
        .callout.good p strong { color: var(--cyan); }

        .method-cards {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 1px; background: var(--border); border: 1px solid var(--border);
          overflow: hidden; margin: 24px 0;
        }
        .method-card { background: var(--bg2); padding: 24px; transition: background 0.15s; }
        .method-card:hover { background: var(--surface); }
        .method-letter {
          font-family: var(--font-display); font-size: 28px; font-weight: 800;
          color: var(--green); line-height: 1; margin-bottom: 8px; opacity: 0.7;
        }
        .method-card h4 {
          font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 6px;
        }
        .method-card p { font-size: 12px; color: var(--text-dim); line-height: 1.6; margin: 0; }

        .pill-grid { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
        .pill {
          font-size: 12px; color: var(--text-dim); background: var(--bg2);
          border: 1px solid var(--border); padding: 5px 12px;
          letter-spacing: 0.2px; transition: all 0.15s;
        }
        .pill:hover { border-color: var(--border2); color: var(--text); }
        .pill.accent {
          background: var(--green-glow); border-color: var(--green-dim); color: var(--green);
        }

        .example-block {
          background: var(--bg2); border: 1px solid var(--border);
          overflow: hidden; margin: 24px 0;
        }
        .example-header {
          padding: 10px 16px; border-bottom: 1px solid var(--border);
          font-size: 11px; color: var(--text-muted); letter-spacing: 1px;
          text-transform: uppercase;
        }
        .example-header::before {
          content: ''; display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: var(--green); margin-right: 8px;
          vertical-align: middle;
        }
        .example-body {
          padding: 20px 24px; font-size: 13px; color: var(--text-dim); line-height: 1.8;
        }
        .hl { color: var(--cyan); font-weight: 500; }

        .incident-card {
          background: var(--bg2); border: 1px solid rgba(255,79,79,0.2);
          border-left: 3px solid var(--red); padding: 20px 24px; margin: 24px 0;
        }
        .incident-label {
          font-size: 11px; color: var(--red); letter-spacing: 1px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .incident-card p { font-size: 13px; color: var(--text-dim); line-height: 1.7; margin: 0; }

        @media (max-width: 860px) {
          .resume-layout { grid-template-columns: 1fr; padding: 48px 24px; }
          .resume-toc { display: none; }
          .resume-hero { padding: 60px 24px; }
          .method-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
