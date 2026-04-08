'use client';

import { useState } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../lib/supabase';

const TOTAL_STEPS = 6;
const STEP_LABELS = ['Identity', 'Role', 'Compensation', 'Stack', 'Sentiment', 'Community'];

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayField = (key, value) => {
    setFormData(prev => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const stepNext = () => {
    if (currentStep === TOTAL_STEPS) {
      submitSurvey();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const stepBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const submitSurvey = async () => {
    const payload = {
      email: formData.email || '',
      job_title: formData.jobTitle || '',
      location: formData.location || '',
      work_arrangement: formData.workArrangement || '',
      sre_resemblance: parseInt(formData.sreResemblance) || null,
      sre_valued: parseInt(formData.sreValued) || null,
      salary: formData.salary || '',
      benefits: (formData.benefits || []).join(', '),
      current_tech: (formData.currentTech || []).join(', '),
      wanted_tech: (formData.wantedTech || []).join(', '),
      initiatives: (formData.initiatives || []).join(', '),
      culture: formData.culture || '',
      hiring_challenges: formData.hiring || '',
      how_got_in: formData.howGotIn || '',
      why_chose: formData.whyChose || '',
      jd_accuracy: parseInt(formData.jdAccuracy) || null,
      motivators: (formData.motivators || []).join(', '),
      community_thoughts: formData.community || '',
      slack_interest: formData.slack || '',
      meetup_interest: formData.meetups || '',
      thought_leadership: formData.thoughtLeadership || '',
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contributors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Something went wrong submitting your response. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch (e) {
      alert('Network error. Please check your connection and try again.');
    }
  };

  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const RadioGroup = ({ name, options, value, onChange }) => (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt} className={`radio-option ${value === opt ? 'active' : ''}`}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );

  const RatingRow = ({ name, value, onChange, max = 5 }) => (
    <div className="rating-row">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <label key={n} className={`rating-option ${value === String(n) ? 'active' : ''}`}>
          <input type="radio" name={name} value={n} checked={value === String(n)} onChange={() => onChange(String(n))} />
          {n}
        </label>
      ))}
    </div>
  );

  const TagGrid = ({ options, selected = [], onToggle }) => (
    <div className="tag-grid">
      {options.map(opt => (
        <label key={opt} className={`tag-option ${selected.includes(opt) ? 'active' : ''}`}>
          <input type="checkbox" value={opt} checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="survey-page">
        <div className="survey-container">
          <div className="success-state">
            <div className="success-icon">✓</div>
            <div className="success-label">Submission received</div>
            <h3>Thanks for contributing.</h3>
            <p>You will receive the full State of SRE ANZ report at the end of H1 2026. Keep an eye on your inbox.</p>
            <a href="/" className="btn-primary">Back to site →</a>
          </div>
        </div>
        <style jsx>{surveyStyles}</style>
      </div>
    );
  }

  return (
    <div className="survey-page">
      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>

      {/* Step label */}
      <div className="step-header">
        <span className="step-label">{STEP_LABELS[currentStep - 1]} — {currentStep} of {TOTAL_STEPS}</span>
      </div>

      <div className="survey-container">
        {/* STEP 1: Identity */}
        {currentStep === 1 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 1 of 6</div>
              <h2>Let&apos;s start with you.</h2>
              <p>We will send the report to your email when it is published. Your details are never shared.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>Email address <span className="req">*</span></label>
                <input type="email" value={formData.email || ''} onChange={e => updateField('email', e.target.value)} placeholder="you@company.com" />
              </div>
              <div className="form-group">
                <label>Current job title <span className="req">*</span></label>
                <input type="text" value={formData.jobTitle || ''} onChange={e => updateField('jobTitle', e.target.value)} placeholder="e.g. Senior SRE, Platform Engineer" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Role */}
        {currentStep === 2 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 2 of 6</div>
              <h2>Your role and context.</h2>
              <p>Tell us about where you work and how SRE fits into your organisation.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>Location <span className="req">*</span></label>
                <select value={formData.location || ''} onChange={e => updateField('location', e.target.value)}>
                  <option value="">Select city</option>
                  {['Sydney','Melbourne','Brisbane','Perth','Adelaide','Auckland','Wellington','Remote – ANZ','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Working situation <span className="req">*</span></label>
                <RadioGroup name="work" options={['Remote','Hybrid','On-site']} value={formData.workArrangement} onChange={v => updateField('workArrangement', v)} />
              </div>
              <div className="form-group">
                <label>How closely does your role resemble SRE? <span className="req">*</span></label>
                <div className="rating-hint">1 = not at all &nbsp;&nbsp; 5 = by the book</div>
                <RatingRow name="resemblance" value={formData.sreResemblance} onChange={v => updateField('sreResemblance', v)} />
              </div>
              <div className="form-group">
                <label>Is SRE valued in your organisation? <span className="req">*</span></label>
                <div className="rating-hint">1 = not at all &nbsp;&nbsp; 5 = highly valued</div>
                <RatingRow name="value" value={formData.sreValued} onChange={v => updateField('sreValued', v)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Compensation */}
        {currentStep === 3 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 3 of 6</div>
              <h2>Compensation.</h2>
              <p>This is the core of the benchmark. Company names are never shown in the report.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>Current base salary, excluding super <span className="req">*</span></label>
                <div className="salary-options">
                  {['100 - 120','120 - 140','140 - 160','160 -180','180 - 200,000','200,000 +','Day Rate'].map(s => (
                    <label key={s} className={`salary-option ${formData.salary === s ? 'active' : ''}`}>
                      <input type="radio" name="salary" value={s} checked={formData.salary === s} onChange={() => updateField('salary', s)} />
                      {s === 'Day Rate' ? 'Day rate' : `$${s.replace(/,/g,'').replace(/ /g,'')}k`}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Current benefits</label>
                <TagGrid options={['Bonus','Stock','L&D Budget','Office / Machine Budget','Work from anywhere','Extra Holiday','Insurance Discount','Other']} selected={formData.benefits} onToggle={v => toggleArrayField('benefits', v)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Stack */}
        {currentStep === 4 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 4 of 6</div>
              <h2>Your stack.</h2>
              <p>Select what you are working with today, and tell us what you would like to use.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>Current technologies <span className="req">*</span></label>
                <TagGrid options={['Kubernetes','Terraform','AWS','GCP','Azure','Prometheus','Grafana','Datadog','OpenTelemetry','ArgoCD','Helm','Go','Python','PagerDuty','Istio','eBPF/Cilium','LLMs','GPUs','CI/CD','MLOps']} selected={formData.currentTech} onToggle={v => toggleArrayField('currentTech', v)} />
              </div>
              <div className="form-group">
                <label>Technologies you would like to work with</label>
                <TagGrid options={['Kubernetes','Terraform','AWS','GCP','Azure','Prometheus','Grafana','Datadog','OpenTelemetry','ArgoCD','Helm','Go','Python','PagerDuty','Istio','eBPF/Cilium','LLMs','GPUs','CI/CD','MLOps']} selected={formData.wantedTech} onToggle={v => toggleArrayField('wantedTech', v)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Sentiment */}
        {currentStep === 5 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 5 of 6</div>
              <h2>Sentiment and culture.</h2>
              <p>The qualitative heart of the report. What is actually happening on the ground in ANZ SRE.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>What SRE initiatives have you been working on? <span className="req">*</span></label>
                <TagGrid options={['Chaos Engineering','Reducing Toil','Observability','OpenTelemetry','Other']} selected={formData.initiatives} onToggle={v => toggleArrayField('initiatives', v)} />
              </div>
              <div className="form-group">
                <label>What is the SRE engineering culture like at your org? <span className="req">*</span></label>
                <textarea value={formData.culture || ''} onChange={e => updateField('culture', e.target.value)} placeholder="e.g. Strong blameless postmortem culture, but SLOs not widely adopted..." />
              </div>
              <div className="form-group">
                <label>What challenges do you find when recruiting for SRE? <span className="req">*</span></label>
                <textarea value={formData.hiring || ''} onChange={e => updateField('hiring', e.target.value)} placeholder="e.g. Very few candidates with observability depth..." />
              </div>
              <div className="form-group">
                <label>How did you get into SRE? <span className="req">*</span></label>
                <textarea value={formData.howGotIn || ''} onChange={e => updateField('howGotIn', e.target.value)} placeholder="e.g. Started as a sysadmin..." />
              </div>
              <div className="form-group">
                <label>What made you choose or stay in SRE? <span className="req">*</span></label>
                <textarea value={formData.whyChose || ''} onChange={e => updateField('whyChose', e.target.value)} placeholder="e.g. The intersection of software eng and ops thinking..." />
              </div>
              <div className="form-group">
                <label>How accurate are SRE job descriptions in Australia? <span className="req">*</span></label>
                <RatingRow name="jdAccuracy" value={formData.jdAccuracy} onChange={v => updateField('jdAccuracy', v)} />
              </div>
              <div className="form-group">
                <label>Top motivators when assessing a new opportunity <span className="req">*</span></label>
                <TagGrid options={['Salary Package','Bonus','Tech Stack','Remote','Hybrid','Progression','Manager','Culture','Other']} selected={formData.motivators} onToggle={v => toggleArrayField('motivators', v)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Community */}
        {currentStep === 6 && (
          <div className="survey-step">
            <div className="step-intro">
              <div className="step-num">Step 6 of 6</div>
              <h2>The community.</h2>
              <p>Last step. Tell us how you see the SRE community in ANZ and what you would like more of.</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label>What are your thoughts on the SRE community in Australia? <span className="req">*</span></label>
                <textarea value={formData.community || ''} onChange={e => updateField('community', e.target.value)} placeholder="e.g. Growing fast but still fragmented..." />
              </div>
              <div className="form-group">
                <label>Interested in a localised SRE Slack group?</label>
                <RadioGroup name="slack" options={['Yes','No','Already in one']} value={formData.slack} onChange={v => updateField('slack', v)} />
              </div>
              <div className="form-group">
                <label>Interested in more meetups and events?</label>
                <RadioGroup name="meetups" options={['Yes','No']} value={formData.meetups} onChange={v => updateField('meetups', v)} />
              </div>
              <div className="form-group">
                <label>Interested in a thought leadership interview or branding opportunity?</label>
                <input type="text" value={formData.thoughtLeadership || ''} onChange={e => updateField('thoughtLeadership', e.target.value)} placeholder="Name, email and/or phone — leave blank to skip" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="step-nav">
          {currentStep > 1 && (
            <button onClick={stepBack} className="btn-secondary">← Back</button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={stepNext} className="btn-primary">
              {currentStep === TOTAL_STEPS ? 'Submit and get the report →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{surveyStyles}</style>
    </div>
  );
}

const surveyStyles = `
  .survey-page {
    padding-top: 56px;
    min-height: 100vh;
    background: var(--bg);
  }
  .progress-track {
    height: 2px;
    background: var(--border);
    position: sticky;
    top: 56px;
    z-index: 50;
  }
  .progress-fill {
    height: 100%;
    background: var(--green);
    transition: width 0.4s ease;
  }
  .step-header {
    padding: 16px 40px;
    border-bottom: 1px solid var(--border);
    background: rgba(13,15,14,0.96);
    position: sticky;
    top: 58px;
    z-index: 49;
  }
  .step-label {
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 0.5px;
  }
  .survey-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 48px 24px 96px;
  }
  .step-intro {
    margin-bottom: 40px;
  }
  .step-num {
    font-size: 11px;
    color: var(--green);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .step-intro h2 {
    font-family: var(--font-display);
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.15;
    color: var(--white);
    margin-bottom: 12px;
  }
  .step-intro p {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.7;
  }
  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 0.3px;
  }
  .req { color: var(--green); }
  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group textarea,
  .form-group select {
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--white);
    font-family: var(--font-mono);
    font-size: 13px;
    padding: 12px 16px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: var(--green-dim);
  }
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--text-muted);
  }
  .form-group textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.6;
  }
  .form-group select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7d66' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }
  .rating-hint {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.3px;
  }
  .radio-group, .rating-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .radio-option, .rating-option {
    padding: 10px 20px;
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    flex: 1;
    min-width: 60px;
  }
  .radio-option input, .rating-option input { display: none; }
  .radio-option.active, .rating-option.active {
    background: var(--green-glow);
    border-color: var(--green-dim);
    color: var(--green);
  }
  .radio-option:hover, .rating-option:hover {
    border-color: var(--border2);
    color: var(--text);
  }
  .tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tag-option {
    font-size: 12px;
    padding: 5px 12px;
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.2px;
  }
  .tag-option input { display: none; }
  .tag-option.active {
    background: var(--green-glow);
    border-color: var(--green-dim);
    color: var(--green);
  }
  .tag-option:hover {
    border-color: var(--border2);
    color: var(--text);
  }
  .salary-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  .salary-option {
    padding: 10px;
    text-align: center;
    background: var(--bg2);
    border: 1px solid var(--border);
    cursor: pointer;
    font-size: 12px;
    color: var(--text-dim);
    transition: all 0.15s;
  }
  .salary-option input { display: none; }
  .salary-option.active {
    background: var(--green-glow);
    border-color: var(--green-dim);
    color: var(--green);
  }
  .step-nav {
    display: flex;
    align-items: center;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
  }
  .success-state {
    text-align: center;
    padding: 64px 0;
  }
  .success-icon {
    width: 56px;
    height: 56px;
    border: 1px solid var(--green-dim);
    background: var(--green-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 22px;
    color: var(--green);
  }
  .success-label {
    font-size: 11px;
    color: var(--green);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .success-state h3 {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 800;
    color: var(--white);
    margin-bottom: 16px;
  }
  .success-state p {
    color: var(--text-dim);
    font-size: 13px;
    line-height: 1.7;
    max-width: 420px;
    margin: 0 auto 32px;
  }
  @media (max-width: 600px) {
    .salary-options { grid-template-columns: repeat(2, 1fr); }
  }
`;
