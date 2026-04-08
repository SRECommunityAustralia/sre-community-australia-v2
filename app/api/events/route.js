// /app/api/events/route.js
// Fetches upcoming events from Meetup's public GraphQL endpoint
// Falls back to /public/events.json if Meetup is unreachable

const GROUPS = [
  { urlname: 'melbourne-sre-meetup', city: 'Melbourne' },
  { urlname: 'sydney-sre-meetup', city: 'Sydney' },
];

// Meetup's public frontend GraphQL endpoint (no auth required)
const MEETUP_GQL = 'https://www.meetup.com/gql2';

async function fetchMeetupEvents(urlname) {
  // This uses the same persisted query that Meetup's own frontend uses
  // to load upcoming events on a group page
 const query = `
    query ($urlname: String!) {
      groupByUrlname(urlname: $urlname) {
        id
        name
        urlname
        events {
          edges {
            node {
              id
              title
              eventUrl
              dateTime
              duration
              description
              going {
                totalCount
              }
              venue {
                name
                city
                state
              }
              eventType
            }
          }
        }
      }
    }
  `;

  const res = await fetch(MEETUP_GQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
    body: JSON.stringify({
      query,
      variables: { urlname },
    }),
    // Cache for 1 hour on Vercel edge
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.log(`[Events] Meetup GQL returned ${res.status} for ${urlname}`);
    return null;
  }

  const json = await res.json();

  if (json.errors) {
    console.log(`[Events] Meetup GQL errors for ${urlname}:`, json.errors);
    return null;
  }

  const group = json.data?.groupByUrlname;
  if (!group) return null;

return (group.events?.edges || []).map(({ node }) => ({    id: node.id,
    title: node.title,
    url: node.eventUrl,
    dateTime: node.dateTime,
    duration: node.duration,
    description: (node.description || '').substring(0, 200),
going: node.going?.totalCount || null,    venue: node.venue?.name || null,
    city: node.venue?.city || null,
    eventType: node.eventType,
    group: group.name,
    groupUrlname: group.urlname,
  }));
}

export async function GET() {
  let allEvents = [];
  let source = 'meetup';

  // Try fetching from Meetup for each group
  for (const group of GROUPS) {
    try {
      const events = await fetchMeetupEvents(group.urlname);
      if (events && events.length > 0) {
        // Tag each event with the city
        allEvents.push(...events.map(e => ({ ...e, badge: group.city })));
      }
    } catch (err) {
      console.log(`[Events] Failed to fetch ${group.urlname}:`, err.message);
    }
  }

  // If Meetup returned nothing, fall back to static JSON
  if (allEvents.length === 0) {
    source = 'fallback';
    try {
      const { fallbackEvents } = await import('./fallback.js');
      allEvents = fallbackEvents;
    } catch {
      allEvents = [];
    }
  }

// Filter out past events (only for live Meetup data, keep fallback as-is)
  if (source === 'meetup') {
    const now = new Date();
    allEvents = allEvents.filter(e => new Date(e.dateTime) > now);
  }
  allEvents.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  return Response.json({
    source,
    updated: new Date().toISOString(),
    events: allEvents,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}