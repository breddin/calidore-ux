import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({});
let cachedKey = null;

async function getApiKey() {
  if (cachedKey) return cachedKey;
  const { Parameter } = await ssm.send(new GetParameterCommand({
    Name: process.env.ANTHROPIC_API_KEY_PARAM,
    WithDecryption: true
  }));
  cachedKey = Parameter.Value;
  return cachedKey;
}

export const handler = async (event) => {
  // CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS') {
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
