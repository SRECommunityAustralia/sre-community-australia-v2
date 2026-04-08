// Supabase configuration for SRE Community Australia
// Used by survey submission and report email verification

export const SUPABASE_URL = 'https://dihbvaajzudidcebrzia.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaGJ2YWFqenVkaWRjZWJyemlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMzA2MTIsImV4cCI6MjA4OTgwNjYxMn0.zPEhr3gCGaqpz0CdvIDgvMo57zjf7WEkUlBydLA0auE';

// Google Sheets published CSV for live data
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQrCvf_jf36nB41KsjdV8BoxMuurdapjUzUWHeiNZ01Sby77bBe1v5ahuNn2_sc6c3g1icZXz4f5ZUE/pub?gid=397480170&single=true&output=csv';

// Column mapping for Google Form response sheet
export const COLS = {
  timestamp:       0,
  email:           1,
  jobTitle:        2,
  sreResemblance:  3,
  sreValued:       4,
  initiatives:     5,
  culture:         6,
  hiringChallenge: 7,
  howGotIn:        8,
  whyChose:        9,
  salary:          10,
  workArrangement: 11,
  benefits:        12,
  currentTech:     13,
  wantedTech:      14,
  jdAccuracy:      15,
  motivators:      16,
  communityThoughts: 17,
  slackInterest:   18,
  meetupInterest:  19,
  thoughtLeadership: 20,
};

export const SALARY_MIDPOINTS = {
  '100 - 120':       110000,
  '120 - 140':       130000,
  '140 - 160':       150000,
  '160 -180':        170000,
  '180 - 200,000':   190000,
  '200,000 +':       215000,
  'Day Rate':        null,
};

export const SALARY_LABELS = {
  '100 - 120': '$100-120k',
  '120 - 140': '$120-140k',
  '140 - 160': '$140-160k',
  '160 -180': '$160-180k',
  '180 - 200,000': '$180-200k',
  '200,000 +': '$200k+',
  'Day Rate': 'Day rate',
};
