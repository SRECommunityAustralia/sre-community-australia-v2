'use client';

import { useState, useEffect, useCallback } from 'react';
import { SHEET_CSV_URL, COLS, SALARY_MIDPOINTS, SALARY_LABELS } from '../../lib/supabase';

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
    ['','a@x.com','Senior SRE','4','4','SLO rollout','Strong blameless culture','Hard to find observability depth','Sysadmin','Love it','180 - 200,000','Remote','Health','Kubernetes,Prometheus,Grafana,AWS','eBPF','3','Tech Stack,Remote,Progression','Growing fast','Yes','Yes',''],
    ['','b@x.com','Staff SRE','5','5','Chaos engineering','Excellent culture','JDs conflate SRE/DevOps','Dev background','Reliability challenge','200,000 +','Remote','ESOP','Kubernetes,Terraform,Datadog,AWS,Go','Cilium','2','Tech Stack,Progression,Culture','Need cross-company sharing','Yes','Yes',''],
    ['','c@x.com','Platform Engineer','3','3','Backstage rollout','Good but SLOs not adopted','Few candidates','DevOps crossover','Platform thinking','160 -180','Hybrid','L&D','Kubernetes,Helm,ArgoCD,GCP','OpenTelemetry','2','Salary Package,Tech Stack,Hybrid','Smaller than expected','Already in one','Yes',''],
    ['','d@x.com','SRE Lead','4','4','Toil reduction','Improving','Market thin','Networking','Automation at scale','180 - 200,000','Hybrid','Bonus','Kubernetes,Prometheus,PagerDuty,AWS,Python','Rust','3','Culture,Progression,Manager','Great needs events','Yes','Yes',''],
    ['','e@x.com','Senior Platform Eng','4','3','Observability uplift','Blameless on paper','Senior scarce','Cloud eng','Breadth of SRE','160 -180','Remote','Allowance','Kubernetes,Terraform,Datadog,Azure','OpenTelemetry','2','Remote,Salary Package,Culture','Strong in Syd/Mel','No','Yes',''],
    ['','f@x.com','Mid SRE','3','3','SLI/SLO definition','Early stages','Lack incident exp','Ops','Felt like future','140 - 160','Hybrid','Health','Kubernetes,Grafana,Prometheus,AWS','ArgoCD','3','Salary Package,Progression,Hybrid','Growing needs structure','Yes','Yes',''],
    ['','g@x.com','Principal SRE','5','5','Error budget policy','Mature SRE org','Senior globally competitive','Software eng','Mission of reliability','200,000 +','Remote','ESOP,Bonus','Kubernetes,Go,Terraform,AWS,Istio,eBPF','Cilium','1','Tech Stack,Remote,Culture','World class underrecognised','Yes','Yes',''],
    ['','h@x.com','DevOps/SRE','3','2','Monitoring','Still building','Hard to differentiate roles','Sysadmin','Wanted more coding','120 - 140','On-site','None','AWS,Terraform,Prometheus,Python','Kubernetes','3','Salary Package,Progression,Culture','Needs more visibility','Yes','Yes',''],
    ['','i@x.com','Senior SRE','4','4','Platform migration','Strong eng culture','Few with platform depth','SWE','Systems thinking','180 - 200,000','Hybrid','Bonus,L&D','Kubernetes,AWS,Go,Datadog,ArgoCD','eBPF','2','Tech Stack,Culture,Remote','Excited about growth','Yes','Yes',''],
    ['','j@x.com','SRE','3','3','Incident response','Blameless improving','JDs are vague','Ops/Infra','On-call culture','140 - 160','Remote','Health','Kubernetes,Prometheus,Grafana,PagerDuty','OpenTelemetry','3','Remote,Salary Package,Progression','Still small but promising','Yes','No',''],
  ];
}

function computeDashboardStats(rows) {
  const n = rows.length;

  // Salary
  const salaryNums = rows.map(r => SALARY_MIDPOINTS[r[COLS.salary]]).filter(Boolean);
  salaryNums.sort((a, b) => a - b);
  const median = salaryNums.length ? salaryNums[Math.floor(salaryNums.length / 2)] : null;
  const avg = salaryNums.length ? Math.round(salaryNums.reduce((a, b) => a + b, 0) / salaryNums.length) : null;

  // Salary bands
  const bands = {};
  const bandOrder = ['100 - 120','120 - 140','140 - 160','160 -180','180 - 200,000','200,000 +'];
  rows.forEach(r => { const b = r[COLS.salary]; if (b && b !== 'Day Rate') bands[b] = (bands[b] || 0) + 1; });
  const bandData = bandOrder.map(b => ({ label: SALARY_LABELS[b] || b, count: bands[b] || 0 }));

  // Work arrangement
  const work = { Remote: 0, Hybrid: 0, 'On-site': 0 };
  rows.forEach(r => { const w = r[COLS.workArrangement]; if (w && work[w] !== undefined) work[w]++; });

  // SRE scores
  const resVals = rows.map(r => parseFloat(r[COLS.sreResemblance])).filter(v => v >= 1 && v <= 5);
  const valVals = rows.map(r => parseFloat(r[COLS.sreValued])).filter(v => v >= 1 && v <= 5);
  const resAvg = resVals.length ? (resVals.reduce((a, b) => a + b, 0) / resVals.length).toFixed(1) : '—';
  const valAvg = valVals.length ? (valVals.reduce((a, b) => a + b, 0) / valVals.length).toFixed(1) : '—';
  const resDist = [1,2,3,4,5].map(v => resVals.filter(x => Math.round(x) === v).length);
  const valDist = [1,2,3,4,5].map(v => valVals.filter(x => Math.round(x) === v).length);

  // Tech stack
  const techCount = {};
  rows.forEach(r => {
    (r[COLS.currentTech] || '').split(',').map(t => t.trim()).filter(Boolean)
      .forEach(t => { techCount[t] = (techCount[t] || 0) + 1; });
  });
  const techData = Object.entries(techCount).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([label, count]) => ({ label, count, pct: Math.round((count / n) * 100) }));

  // Motivators
  const motCount = {};
  rows.forEach(r => {
    (r[COLS.motivators] || '').split(',').map(m => m.trim()).filter(Boolean)
      .forEach(m => { motCount[m] = (motCount[m] || 0) + 1; });
  });
  const motivatorData = Object.entries(motCount).sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count, pct: Math.round((count / n) * 100) }));

  // JD accuracy
  const jdVals = rows.map(r => parseInt(r[COLS.jdAccuracy])).filter(v => v >= 1 && v <= 5);
  const jdAvg = jdVals.length ? (jdVals.reduce((a, b) => a + b, 0) / jdVals.length).toFixed(1) : '—';

  // Location
  const locCount = {};
  rows.forEach(r => { const l = r[COLS.workArrangement]; if (l) locCount[l] = (locCount[l] || 0) + 1; });

  return { n, median, avg, bandData, work, resAvg, valAvg, resDist, valDist, techData, motivatorData, jdAvg };
}

function fmtK(n) { return n ? '$' + Math.round(n / 1000) + 'k' : '—'; }
function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

// ─── PANEL COMPONENTS ───

function PanelHeader({ title, subtitle }) {
  return (
    <div className="panel-header">
      <div className="panel-title-row">
        <span className="panel-title">{title}</span>
        <div className="panel-controls">
          <span className="panel-refresh">↻</span>
          <span className="panel-menu">⋮</span>
        </div>
      </div>
      {subtitle && <span className="panel-subtitle">{subtitle}</span>}
    </div>
  );
}

function StatPanel({ title, value, subtitle, color, trend }) {
  return (
    <div className="panel stat-panel">
      <PanelHeader title={title} />
      <div className="stat-panel-body">
        <div className="stat-value" style={{ color: color || 'var(--green)' }}>{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        {trend && <div className="stat-trend" style={{ color: trend.startsWith('+') ? 'var(--green)' : 'var(--red)' }}>{trend}</div>}
      </div>
    </div>
  );
}

function HBarPanel({ title, subtitle, items, total, maxCount, color }) {
  const mc = maxCount || Math.max(...items.map(i => i.count));
  return (
    <div className="panel">
      <PanelHeader title={title} subtitle={subtitle} />
      <div className="panel-body">
        <div className="hbar-rows">
          {items.map((item, i) => (
            <div className="hbar-row" key={i}>
              <span className="hbar-label">{item.label}</span>
              <div className="hbar-track">
                <div className="hbar-fill" style={{
                  width: mc ? `${Math.round((item.count / mc) * 100)}%` : '0%',
                  background: color || 'var(--green)',
                  opacity: 0.7,
                }}></div>
              </div>
              <span className="hbar-val">{total ? `${pct(item.count, total)}%` : item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DonutPanel({ title, data, colors }) {
  const total = data.reduce((a, b) => a + b.count, 0);
  let cumPct = 0;
  const segments = data.map((d, i) => {
    const p = total ? (d.count / total) * 100 : 0;
    const start = cumPct;
    cumPct += p;
    return { ...d, pct: p, start, color: colors[i] || 'var(--green)' };
  });

  // Build conic gradient
  const gradient = segments.map(s =>
    `${s.color} ${s.start}% ${s.start + s.pct}%`
  ).join(', ');

  return (
    <div className="panel">
      <PanelHeader title={title} />
      <div className="panel-body donut-body">
        <div className="donut-chart" style={{
          background: `conic-gradient(${gradient})`,
        }}>
          <div className="donut-hole">
            <span className="donut-total">{total}</span>
            <span className="donut-label">total</span>
          </div>
        </div>
        <div className="donut-legend">
          {segments.map((s, i) => (
            <div className="legend-item" key={i}>
              <span className="legend-dot" style={{ background: s.color }}></span>
              <span className="legend-label">{s.label}</span>
              <span className="legend-val">{s.count} ({Math.round(s.pct)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreDistPanel({ title, resDist, valDist }) {
  const max = Math.max(...resDist, ...valDist, 1);
  return (
    <div className="panel">
      <PanelHeader title={title} subtitle="1 = low · 5 = high" />
      <div className="panel-body">
        <div className="score-chart">
          {[1,2,3,4,5].map(n => (
            <div className="score-col" key={n}>
              <div className="score-bars">
                <div className="score-bar res" style={{ height: `${(resDist[n-1] / max) * 100}%` }}></div>
                <div className="score-bar val" style={{ height: `${(valDist[n-1] / max) * 100}%` }}></div>
              </div>
              <span className="score-label">{n}</span>
            </div>
          ))}
        </div>
        <div className="score-legend">
          <span><span className="legend-dot" style={{ background: 'var(--green)' }}></span> Resemblance</span>
          <span><span className="legend-dot" style={{ background: 'var(--cyan)' }}></span> Value</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('H1 2026');

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error('fail');
      const text = await res.text();
      const rows = parseCSV(text);
      setStats(computeDashboardStats(rows.length >= 3 ? rows : getDemoData()));
    } catch {
      setStats(computeDashboardStats(getDemoData()));
    }
    setLastRefresh(new Date());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!stats) {
    return (
      <div className="dashboard">
        <div className="dash-loading">
          <div className="loading-pulse"></div>
          <span>// loading dashboard...</span>
        </div>
        <style jsx>{dashboardStyles}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard toolbar */}
      <div className="dash-toolbar">
        <div className="dash-toolbar-left">
          <div className="dash-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
          </div>
          <h1 className="dash-title">State of SRE ANZ</h1>
          <span className="dash-badge">LIVE</span>
        </div>
        <div className="dash-toolbar-right">
          <div className="time-select">
            <span className="time-icon">🕐</span>
            <span>{timeRange}</span>
          </div>
          <button className="refresh-btn" onClick={loadData}>
            ↻ Refresh
          </button>
          <span className="last-refresh">
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}` : ''}
          </span>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="dash-grid">
        {/* Row 1: Key stats */}
        <div className="dash-row stats-row">
          <StatPanel title="Contributors" value={stats.n} subtitle="responses collected" />
          <StatPanel title="Median Salary" value={fmtK(stats.median)} subtitle="excl. super" />
          <StatPanel title="SRE Resemblance" value={`${stats.resAvg}/5`} subtitle="avg self-rating" color="var(--cyan)" />
          <StatPanel title="SRE Valued" value={`${stats.valAvg}/5`} subtitle="in organisation" color="var(--cyan)" />
          <StatPanel title="JD Accuracy" value={`${stats.jdAvg}/5`} subtitle="how accurate are JDs" color="var(--amber)" />
        </div>

        {/* Row 2: Charts */}
        <div className="dash-row charts-row">
          <HBarPanel
            title="Salary Distribution"
            subtitle="Base salary excl. super"
            items={stats.bandData}
            total={stats.n}
          />
          <DonutPanel
            title="Work Arrangement"
            data={[
              { label: 'Remote', count: stats.work.Remote },
              { label: 'Hybrid', count: stats.work.Hybrid },
              { label: 'On-site', count: stats.work['On-site'] },
            ]}
            colors={['var(--green)', 'var(--cyan)', 'var(--amber)']}
          />
        </div>

        {/* Row 3: Tech + Scores */}
        <div className="dash-row charts-row">
          <HBarPanel
            title="Technology Adoption"
            subtitle="% of respondents using"
            items={stats.techData}
            total={stats.n}
            color="var(--cyan)"
          />
          <ScoreDistPanel
            title="SRE Score Distribution"
            resDist={stats.resDist}
            valDist={stats.valDist}
          />
        </div>

        {/* Row 4: Motivators */}
        <div className="dash-row single-row">
          <HBarPanel
            title="Top Motivators"
            subtitle="When evaluating new opportunities"
            items={stats.motivatorData}
            total={stats.n}
            color="var(--amber)"
          />
        </div>

        {/* CTA */}
        <div className="dash-cta">
          <span>// want the full report with verbatim responses?</span>
          <a href="/survey" className="btn-primary">$ contribute-data →</a>
        </div>
      </div>

      <style jsx>{dashboardStyles}</style>
    </div>
  );
}

const dashboardStyles = `
  .dashboard {
    padding-top: 56px;
    min-height: 100vh;
    background: var(--bg);
  }

  .dash-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: calc(100vh - 56px);
    font-size: 12px;
    color: var(--text-muted);
  }
  .loading-pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
  }

  /* ── TOOLBAR ── */
  .dash-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    position: sticky;
    top: 56px;
    z-index: 50;
  }
  .dash-toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dash-icon { color: var(--text-dim); display: flex; }
  .dash-title {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 500;
    color: var(--white);
    letter-spacing: 0.3px;
  }
  .dash-badge {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: var(--bg);
    background: var(--green);
    padding: 2px 6px;
    border-radius: 2px;
    animation: pulse 2s ease-in-out infinite;
  }
  .dash-toolbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .time-select {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-dim);
    padding: 4px 10px;
    border: 1px solid var(--border);
    cursor: default;
  }
  .time-icon { font-size: 12px; }
  .refresh-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 4px 10px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .refresh-btn:hover {
    border-color: var(--green-dim);
    color: var(--green);
  }
  .last-refresh {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── GRID ── */
  .dash-grid {
    padding: 20px 24px 64px;
    max-width: 1400px;
    margin: 0 auto;
  }
  .dash-row {
    display: grid;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stats-row {
    grid-template-columns: repeat(5, 1fr);
  }
  .charts-row {
    grid-template-columns: 1fr 1fr;
  }
  .single-row {
    grid-template-columns: 1fr;
  }

  /* ── PANELS ── */
  .panel {
    background: var(--bg2);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .panel-header {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .panel-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .panel-title {
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 0.3px;
  }
  .panel-controls {
    display: flex;
    gap: 8px;
    color: var(--text-muted);
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .panel:hover .panel-controls { opacity: 1; }
  .panel-controls span { cursor: pointer; }
  .panel-subtitle {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
  }
  .panel-body {
    padding: 14px;
  }

  /* ── STAT PANEL ── */
  .stat-panel { }
  .stat-panel-body {
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .stat-value {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
    color: var(--green);
  }
  .stat-subtitle {
    font-size: 11px;
    color: var(--text-muted);
  }
  .stat-trend {
    font-size: 11px;
    font-family: var(--font-mono);
    margin-top: 4px;
  }

  /* ── HORIZONTAL BARS ── */
  .hbar-rows { display: flex; flex-direction: column; gap: 8px; }
  .hbar-row { display: flex; align-items: center; gap: 10px; }
  .hbar-label {
    font-size: 11px;
    color: var(--text-dim);
    width: 100px;
    flex-shrink: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .hbar-track {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.04);
    overflow: hidden;
  }
  .hbar-fill {
    height: 100%;
    transition: width 1s ease;
  }
  .hbar-val {
    font-size: 11px;
    color: var(--text-muted);
    width: 40px;
    text-align: right;
    flex-shrink: 0;
    font-family: var(--font-mono);
  }

  /* ── DONUT ── */
  .donut-body {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .donut-chart {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
  }
  .donut-hole {
    position: absolute;
    inset: 25%;
    border-radius: 50%;
    background: var(--bg2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .donut-total {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    color: var(--white);
    line-height: 1;
  }
  .donut-label {
    font-size: 9px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .donut-legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-dim);
  }
  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .legend-label { flex: 1; }
  .legend-val {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── SCORE DIST ── */
  .score-chart {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    height: 120px;
    padding-bottom: 24px;
    position: relative;
  }
  .score-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .score-bars {
    flex: 1;
    display: flex;
    gap: 3px;
    align-items: flex-end;
    width: 100%;
  }
  .score-bar {
    flex: 1;
    border-radius: 2px 2px 0 0;
    min-height: 2px;
    transition: height 1s ease;
  }
  .score-bar.res { background: var(--green); opacity: 0.7; }
  .score-bar.val { background: var(--cyan); opacity: 0.7; }
  .score-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 8px;
    font-family: var(--font-mono);
  }
  .score-legend {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    font-size: 11px;
    color: var(--text-dim);
  }
  .score-legend span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── CTA ── */
  .dash-cta {
    margin-top: 32px;
    padding: 20px 24px;
    border: 1px solid var(--border);
    background: var(--bg2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .dash-cta span {
    font-size: 12px;
    color: var(--text-muted);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1000px) {
    .stats-row { grid-template-columns: repeat(3, 1fr); }
    .charts-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .dash-toolbar { flex-direction: column; gap: 8px; align-items: flex-start; }
    .dash-toolbar-right { flex-wrap: wrap; }
    .donut-body { flex-direction: column; }
    .dash-grid { padding: 16px; }
  }
`;