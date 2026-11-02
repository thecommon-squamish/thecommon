const INTERESTS = new Set(['Desk or day pass', 'Bookable room', 'Private office', 'Membership', 'Event', 'Something else']);
const SCOPES = 'flex.community.members.read flex.community.members.create flex.community.opportunities.create';

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
    },
  });
}

function validFields(input) {
  if (!input || typeof input !== 'object') return null;
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const phone = String(input.phone || '').trim();
  const interest = String(input.interest || '').trim();
  const message = String(input.message || '').trim();
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 40 || !INTERESTS.has(interest) || message.length < 10 || message.length > 4000) return null;
  return { name, email, phone, interest, message };
}

async function readJson(response) {
  if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
  return response.json();
}

async function officeRndRequest(fetcher, url, token, options = {}) {
  const response = await fetcher(url, {
    ...options,
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  return readJson(response);
}

async function storeInquiry(fields, env, fetcher) {
  const tokenResponse = await fetcher('https://identity.officernd.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.OFFICERND_CLIENT_ID, client_secret: env.OFFICERND_CLIENT_SECRET, grant_type: 'client_credentials', scope: SCOPES }),
  });
  const token = (await readJson(tokenResponse)).access_token;
  if (!token) throw new Error('OfficeRnD token missing');

  const base = `https://app.officernd.com/api/v2/organizations/${encodeURIComponent(env.OFFICERND_ORG_SLUG)}`;
  const memberUrl = new URL(`${base}/members`);
  memberUrl.searchParams.set('email', fields.email);
  const members = await officeRndRequest(fetcher, memberUrl, token);
  if (!Array.isArray(members.results)) throw new Error('Unexpected OfficeRnD member response');
  let member = members.results.find((item) => item.email?.toLowerCase() === fields.email);
  if (!member) {
    member = await officeRndRequest(fetcher, `${base}/members`, token, {
      method: 'POST',
      body: JSON.stringify({ name: fields.name, email: fields.email, ...(fields.phone ? { phone: fields.phone } : {}), location: env.OFFICERND_LOCATION_ID, startDate: new Date().toISOString() }),
    });
  }
  if (!member._id) throw new Error('OfficeRnD member id missing');
  const opportunity = await officeRndRequest(fetcher, `${base}/opportunities`, token, {
    method: 'POST',
    body: JSON.stringify({
      name: `Website inquiry: ${fields.interest} - ${fields.name}`,
      member: member._id,
      status: env.OFFICERND_OPEN_STATUS_ID,
      probability: 10,
      properties: { [env.OFFICERND_MESSAGE_PROPERTY]: fields.message },
    }),
  });
  if (!opportunity._id) throw new Error('OfficeRnD opportunity id missing');
}

export async function handleRequest(request, env, fetcher = fetch) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return new Response('Forbidden', { status: 403 });
  if (new URL(request.url).pathname !== '/contact') return json({ error: 'Not found' }, 404, origin);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' } });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json({ error: 'Invalid request' }, 415, origin);
  if (Number(request.headers.get('Content-Length') || 0) > 12000) return json({ error: 'Message too long' }, 413, origin);
  const required = ['TURNSTILE_SECRET_KEY', 'OFFICERND_CLIENT_ID', 'OFFICERND_CLIENT_SECRET', 'OFFICERND_ORG_SLUG', 'OFFICERND_LOCATION_ID', 'OFFICERND_OPEN_STATUS_ID', 'OFFICERND_MESSAGE_PROPERTY'];
  if (required.some((key) => !env[key])) return json({ error: 'Contact form unavailable' }, 503, origin);

  try {
    const raw = await request.text();
    if (raw.length > 12000) return json({ error: 'Message too long' }, 413, origin);
    const input = JSON.parse(raw);
    if (input.website) return json({ ok: true }, 200, origin);
    const fields = validFields(input);
    if (!fields) return json({ error: 'Please check the fields and try again.' }, 400, origin);
    const challenge = String(input['cf-turnstile-response'] || '');
    if (!challenge) return json({ error: 'Verification required' }, 400, origin);
    const verifyResponse = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: challenge, ...(request.headers.get('CF-Connecting-IP') ? { remoteip: request.headers.get('CF-Connecting-IP') } : {}) }),
    });
    const verification = await readJson(verifyResponse);
    if (!verification.success || !verification.hostname || !allowed.some((item) => new URL(item).hostname === verification.hostname)) return json({ error: 'Verification failed' }, 400, origin);
    await storeInquiry(fields, env, fetcher);
    return json({ ok: true }, 201, origin);
  } catch (error) {
    console.error('Contact submission failed:', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: 'Could not send your message' }, 502, origin);
  }
}

export default { fetch: handleRequest };
