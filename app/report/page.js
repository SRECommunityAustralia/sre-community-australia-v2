'use client';

import { useState, useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY, COLS, SALARY_MIDPOINTS, SALARY_LABELS, SHEET_CSV_URL } from '../../lib/supabase';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  return lines.slice(1).map(line => {
    const cols = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
      else { cur += c; }
    }
    cols.push(cur.trim());
    return cols;
  }).filter(r => r.length > 2 && r[COLS.email]);
}

function getDemoData() {
  return [
    ['','a@x.com','Senior SRE','4','4','SLO rollout','Strong blameless culture','Hard to find observability depth','Sysadmin background','Love the intersection','180 - 200,000','Remote','Health insurance','Kubernetes,Prometheus,Grafana,AWS','eBPF','3','Tech Stack,Remote,Progression','Growing fast but fragmented','Yes','Yes',''],
    ['','b@x.com','Staff SRE','5','5','Chaos engineering','Excellent postmortem culture','JDs conflate SRE with DevOps','Dev background','The reliability challenge','200,000 +','Remote','ESOP','Kubernetes,Terraform,Datadog,AWS,Go','Cilium','2','Tech Stack,Progression,Culture','Need more cross-company sharing','Yes','Yes',''],
    ['','c@x.com','Platform Engineer','3','3','Backstage rollout','Good but SLOs not adopted','Very few candidates','DevOps crossover','Platform thinking','160 -180','Hybrid','L&D budget','Kubernetes,Helm,ArgoCD,GCP','OpenTelemetry','2','Salary Package,Tech Stack,Hybrid','Smaller than expected','Already in one','Yes',''],
    ['','d@x.com','SRE Lead','4','4','Toil reduction','Improving','Market is thin','Started in networking','Automation at scale','180 - 200,000','Hybrid','Bonus','Kubernetes,Prometheus,PagerDuty,AWS,Python','Rust','3','Culture,Progression,Manager','Great, needs more events','Yes','Yes',''],
    ['','e@x.com','Senior Platform Eng','4','3','Observability uplift','Blameless on paper only','Senior SREs scarce','Cloud engineer','Breadth of SRE','160 -180','Remote','Remote allowance','Kubernetes,Terraform,Datadog,Azure','OpenTelemetry','2','Remote,Salary Package,Culture','Strong in Syd and Mel','No','Yes',''],
    ['','f@x.com','Mid SRE','3','3','SLI/SLO definition','Early stages','Lack incident response exp','Ops background','Felt like the future','140 - 160','Hybrid','Health insurance','Kubernetes,Grafana,Prometheus,AWS','ArgoCD','3','Salary Package,Progression,Hybrid','Growing but needs structure','Yes','Yes',''],
    ['','g@x.com','Principal SRE','5','5','Error budget policy','Mature SRE org','Senior talent globally competitive','Software eng','Mission of reliability','200,000 +','Remote','ESOP,Bonus','Kubernetes,Go,Terraform,AWS,Istio,eBPF','Cilium','1','Tech Stack,Remote,Culture','World class talent underrecognised','Yes','Yes',''],
  ];
}

function fmtK(n) { return n ? '$' + Math.round(n / 1000) + 'k' : '\u2014'; }
function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

function computeStats(rows) {
  const n = rows.length;
  const salaryNums = rows.map(r => SALARY_MIDPOINTS[r[COLS.salary]]).filter(Boolean);
  salaryNums.sort((a, b) => a - b);
  const median = salaryNums.length ? salaryNums[Math.floor(salaryNums.length / 2)] : null;
  const avg = salaryNums.length ? Math.round(salaryNums.reduce((a, b) => a + b, 0) / salaryNums.length) : null;
  const max = salaryNums.length ? Math.max(...salaryNums) : null;
  const min = salaryNums.length ? Math.min(...salaryNums) : null;
  const bands = {};
  rows.forEach(r => { const b = r[COLS.salary]; if (b) bands[b] = (bands[b] || 0) + 1; });
  const bandOrder = ['100 - 120','120 - 140','140 - 160','160 -180','180 - 200,000','200,000 +','Day Rate'];
  const bandItems = bandOrder.filter(b => bands[b]).reverse().map(b => ({ label: SALARY_LABELS[b] || b, count: bands[b] }));
  const techCount = {};
  rows.forEach(r => { (r[COLS.currentTech] || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => { techCount[t] = (techCount[t] || 0) + 1; }); });
  const techItems = Object.entries(techCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, count]) => ({ label, count }));
  const work = { Remote: 0, Hybrid: 0, 'On-site': 0 };
  rows.forEach(r => { const w = r[COLS.workArrangement]; if (w && work[w] !== undefined) work[w]++; });
  const resVals = rows.map(r => parseFloat(r[COLS.sreResemblance])).filter(v => v >= 1 && v <= 5);
  const valVals = rows.map(r => parseFloat(r[COLS.sreValued])).filter(v => v >= 1 && v <= 5);
  const resAvg = resVals.length ? (resVals.reduce((a, b) => a + b, 0) / resVals.length).toFixed(1) : '\u2014';
  const valAvg = valVals.length ? (valVals.reduce((a, b) => a + b, 0) / valVals.length).toFixed(1) : '\u2014';
  const motCount = {};
  rows.forEach(r => { (r[COLS.motivators] || '').split(',').map(m => m.trim()).filter(Boolean).forEach(m => { motCount[m] = (motCount[m] || 0) + 1; }); });
  const motivatorItems = Object.entries(motCount).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  const sentimentQuotes = rows.map(r => r[COLS.communityThoughts]).filter(t => t && t.length > 20);
  const hiringQuotes = rows.map(r => r[COLS.hiringChallenge]).filter(t => t && t.length > 20);
  return { n, median, avg, max, min, bandItems, techItems, work, resAvg, valAvg, motivatorItems, sentimentQuotes, hiringQuotes };
}

export default function ReportPage() {
  const [gated, setGated] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('sre_report_access') === '1') {
      setGated(false);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error('fail');
      const text = await res.text();
      const parsed = parseCSV(text);
      setRows(parsed.length >= 3 ? parsed : getDemoData());
    } catch { setRows(getDemoData()); }
  };

  const verifyEmail = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setChecking(true); setError('');
    try {
      const res = await fetch('/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (data.access) { sessionStorage.setItem('sre_report_access', '1'); setGated(false); loadData(); }
      else { setError("We couldn't find that email in our contributors list."); }
    } catch { setError('Something went wrong. Please try again.'); }
    setChecking(false);
  };

  const stats = rows ? computeStats(rows) : null;

  if (gated) return (
    <div style={{ paddingTop: 56, minHeight: '100vh' }}>
      <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 48, maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, border: '1px solid var(--green-dim)', background: 'var(--green-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--green)' }}>&gt;_</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>Access the report.</h2>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 24 }}>This report is exclusive to contributors. Enter the email you used when you submitted your survey data.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && verifyEmail()} placeholder="you@company.com" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--white)', fontFamily: 'var(--font-mono)', fontSize: 13, padding: '12px 16px', outline: 'none', textAlign: 'center' }} />
            <button onClick={verifyEmail} disabled={checking} className="btn-primary" style={{ clipPath: 'none', width: '100%', justifyContent: 'center' }}>{checking ? 'Checking...' : '$ unlock-report'}</button>
          </div>
          {error && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 12 }}>{error}</div>}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>// Haven&apos;t contributed yet? <a href="/survey" style={{ color: 'var(--green)', textDecoration: 'none' }}>Submit your data &rarr;</a></div>
        </div>
      </div>
    </div>
  );

  if (!stats) return (
    <div style={{ paddingTop: 56, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>// loading report data...</p>
    </div>
  );

  const BarRows = ({ items, total, color }) => {
    const maxC = Math.max(...items.map(i => i.count));
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-dim)', width: 120, flexShrink: 0 }}>{item.label}</span>
        <div style={{ flex: 1, height: 8, background: 'var(--bg)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: maxC ? `${Math.round((item.count / maxC) * 100)}%` : '0%', background: color === 'amber' ? 'var(--amber)' : 'var(--green)', opacity: 0.7, transition: 'width 1s ease' }}></div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, textAlign: 'right', flexShrink: 0 }}>{item.count} ({pct(item.count, total)}%)</span>
      </div>
    ))}</div>;
  };

  const tocSections = [
    { id: 's-salary', label: 'Salary breakdown' },
    { id: 's-stack', label: 'Stack premium' },
    { id: 's-work', label: 'Work arrangement' },
    { id: 's-scores', label: 'SRE scores' },
    { id: 's-motivators', label: 'Motivators' },
    { id: 's-sentiment', label: 'Sentiment' },
    { id: 's-hiring', label: 'Hiring challenges' },
  ];

  const StatCards = ({ cards }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginBottom: 24 }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: 'var(--bg2)', padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>{c.value}</div>
          {c.sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{c.sub}</div>}
        </div>
      ))}
    </div>
  );

  const Section = ({ id, num, title, desc, children }) => (
    <div id={id} style={{ marginBottom: 48 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>// {num}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.15, color: 'var(--white)', marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>{desc}</p>
      {children}
      <div style={{ height: 1, background: 'var(--border)', margin: '48px 0' }}></div>
    </div>
  );

  return (
    <div style={{ paddingTop: 56, minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '60px 80px 50px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--green)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>H1 2026 — Contributor report</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, color: 'var(--white)', marginBottom: 16 }}>State of <span style={{ color: 'var(--green)' }}>SRE ANZ</span><br />2026.</h1>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Period <em style={{ fontStyle: 'normal', color: 'var(--text-dim)' }}>H1 2026</em></span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Responses <em style={{ fontStyle: 'normal', color: 'var(--text-dim)' }}>{stats.n}</em></span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Countries <em style={{ fontStyle: 'normal', color: 'var(--text-dim)' }}>AU + NZ</em></span>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => window.print()}>↓ Download PDF</button>
        </div>
      </section>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 64, maxWidth: 1100, margin: '0 auto', padding: '64px 80px 96px', alignItems: 'start' }}>
        <aside style={{ position: 'sticky', top: 76 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}># sections</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tocSections.map(s => (
              <li key={s.id}><a href={`#${s.id}`} style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 10px', display: 'block', borderLeft: '2px solid transparent', transition: 'all 0.15s' }}>{s.label}</a></li>
            ))}
          </ul>
        </aside>

        <div>
          <Section id="s-salary" num="01" title="Salary breakdown" desc="Base salary distribution. Excludes superannuation and day rate contractors.">
            <StatCards cards={[
              { label: 'Median salary', value: fmtK(stats.median), sub: 'excl. super' },
              { label: 'Average salary', value: fmtK(stats.avg) },
              { label: 'Maximum', value: fmtK(stats.max) },
              { label: 'Minimum', value: fmtK(stats.min) },
            ]} />
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>// Salary band distribution</div>
              <BarRows items={stats.bandItems} total={stats.n} />
            </div>
          </Section>

          <Section id="s-stack" num="02" title="Stack premium analysis" desc="The technologies most commonly used by respondents.">
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>// Top technologies in use</div>
              <BarRows items={stats.techItems} total={stats.n} />
            </div>
          </Section>

          <Section id="s-work" num="03" title="Work arrangement" desc="How the ANZ SRE community is working.">
            <StatCards cards={[
              { label: 'Remote', value: pct(stats.work.Remote, stats.n) + '%', sub: stats.work.Remote + ' respondents' },
              { label: 'Hybrid', value: pct(stats.work.Hybrid, stats.n) + '%', sub: stats.work.Hybrid + ' respondents' },
              { label: 'On-site', value: pct(stats.work['On-site'], stats.n) + '%', sub: stats.work['On-site'] + ' respondents' },
            ]} />
          </Section>

          <Section id="s-scores" num="04" title="SRE resemblance and value scores" desc="How closely engineers feel their role resembles SRE (1-5), and how valued SRE is within their org.">
            <StatCards cards={[
              { label: 'SRE resemblance avg', value: stats.resAvg + '/5' },
              { label: 'SRE value avg', value: stats.valAvg + '/5' },
            ]} />
          </Section>

          <Section id="s-motivators" num="05" title="Top motivators" desc="What drives SRE engineers when evaluating new opportunities.">
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>// Motivator rankings</div>
              <BarRows items={stats.motivatorItems} total={stats.n} color="amber" />
            </div>
          </Section>

          <Section id="s-sentiment" num="06" title="Community sentiment" desc="What the community thinks about SRE in Australia. Anonymised verbatim.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.sentimentQuotes.slice(0, 5).map((q, i) => (
                <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--green-dim)', padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{q}&rdquo;</p>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>// anonymous contributor</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="s-hiring" num="07" title="Hiring challenges" desc="What organisations find hardest when recruiting for SRE roles in ANZ.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.hiringQuotes.slice(0, 5).map((q, i) => (
                <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--amber-dim, var(--amber))', padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, fontStyle: 'italic' }}>&ldquo;{q}&rdquo;</p>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>// anonymous contributor</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
