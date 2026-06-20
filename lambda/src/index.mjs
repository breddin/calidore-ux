import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secrets = new SecretsManagerClient({});
let cachedKey = null;

async function getApiKey() {
  if (cachedKey) return cachedKey;
  const { SecretString } = await secrets.send(new GetSecretValueCommand({
    SecretId: process.env.ANTHROPIC_API_KEY_SECRET
  }));
  cachedKey = SecretString;
  return cachedKey;
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path;

  // Health check
  if (method === 'GET' && path === '/') {
    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'ok', service: 'calidore-ux-proxy' })
    };
  }

  // CORS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders()
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const apiKey = await getApiKey();

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  // Stream: read full body and forward as SSE text
  // Lambda HTTP API supports response streaming via Response Streaming, but for
  // simplicity we buffer and return the SSE text so the browser reader loop works.
  const text = await upstream.text();

  return {
    statusCode: upstream.status,
    headers: {
      ...corsHeaders(),
      'content-type': upstream.headers.get('content-type') || 'text/event-stream'
    },
    body: text
  };
};

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, anthropic-version'
  };
}
