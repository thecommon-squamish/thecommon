import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from './index.js';

const env = {
  ALLOWED_ORIGINS: 'https://thecommon-squamish.github.io',
  TURNSTILE_SECRET_KEY: 'test-secret',
  OFFICERND_CLIENT_ID: 'test-id',
  OFFICERND_CLIENT_SECRET: 'test-secret',
  OFFICERND_ORG_SLUG: 'thecommon',
  OFFICERND_LOCATION_ID: 'location-1',
  OFFICERND_OPEN_STATUS_ID: 'open-1',
  OFFICERND_MESSAGE_PROPERTY: 'inquiryNotes',
};
const payload = { name: 'Alex Guest', email: 'alex@example.com', phone: '', interest: 'Private office', message: 'I would like to visit the offices next week.', 'cf-turnstile-response': 'verified' };
function request(body = payload, origin = 'https://thecommon-squamish.github.io') {
  return new Request('https://worker.example/contact', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
function reply(value, status = 200) { return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } }); }

test('rejects a site outside the allowed origins before sending data', async () => {
  const response = await handleRequest(request(payload, 'https://other.example'), env, () => { throw new Error('unexpected call'); });
  assert.equal(response.status, 403);
});

test('rejects a failed verification without touching OfficeRnD', async () => {
  let calls = 0;
  const response = await handleRequest(request(), env, async () => { calls++; return reply({ success: false }); });
  assert.equal(response.status, 400);
  assert.equal(calls, 1);
});

test('reuses an existing contact and records the complete message in one opportunity', async () => {
  const calls = [];
  const fetcher = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('siteverify')) return reply({ success: true, hostname: 'thecommon-squamish.github.io' });
    if (String(url).includes('oauth/token')) return reply({ access_token: 'token' });
    if (String(url).includes('/members?')) return reply({ results: [{ _id: 'member-1', email: payload.email }] });
    if (String(url).endsWith('/opportunities')) return reply({ _id: 'opportunity-1' }, 201);
    throw new Error(`unexpected URL: ${url}`);
  };
  const response = await handleRequest(request(), env, fetcher);
  assert.equal(response.status, 201);
  assert.equal(calls.length, 4);
  const opportunity = JSON.parse(calls.at(-1).options.body);
  assert.equal(opportunity.member, 'member-1');
  assert.equal(opportunity.status, 'open-1');
  assert.equal(opportunity.properties.inquiryNotes, payload.message);
  assert.match(opportunity.name, /Private office/);
});

test('creates a contact when no exact email match exists', async () => {
  const calls = [];
  const fetcher = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('siteverify')) return reply({ success: true, hostname: 'thecommon-squamish.github.io' });
    if (String(url).includes('oauth/token')) return reply({ access_token: 'token' });
    if (String(url).includes('/members?')) return reply({ results: [] });
    if (String(url).endsWith('/members')) return reply({ _id: 'new-member' }, 201);
    if (String(url).endsWith('/opportunities')) return reply({ _id: 'new-opportunity' }, 201);
    throw new Error(`unexpected URL: ${url}`);
  };
  const response = await handleRequest(request(), env, fetcher);
  assert.equal(response.status, 201);
  const member = JSON.parse(calls[3].options.body);
  assert.equal(member.location, 'location-1');
  assert.equal(member.email, payload.email);
  assert.equal(JSON.parse(calls[4].options.body).member, 'new-member');
});

test('does not claim success when OfficeRnD rejects the inquiry', async () => {
  const fetcher = async (url) => {
    if (String(url).includes('siteverify')) return reply({ success: true, hostname: 'thecommon-squamish.github.io' });
    if (String(url).includes('oauth/token')) return reply({ access_token: 'token' });
    if (String(url).includes('/members?')) return reply({ results: [{ _id: 'member-1', email: payload.email }] });
    return reply({ error: 'bad request' }, 400);
  };
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleRequest(request(), env, fetcher);
    assert.equal(response.status, 502);
  } finally { console.error = originalError; }
});
