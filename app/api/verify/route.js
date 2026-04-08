import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return Response.json({ access: false, error: 'Invalid email' }, { status: 400 });
    }

    // Check if email exists in contributors table
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/contributors?email=eq.${encodeURIComponent(email)}&select=email&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return Response.json({ access: false, error: 'Verification failed' }, { status: 500 });
    }

    const data = await res.json();
    return Response.json({ access: data.length > 0 });
  } catch (e) {
    return Response.json({ access: false, error: 'Server error' }, { status: 500 });
  }
}
