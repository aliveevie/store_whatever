import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid url' }), { status: 400 });
    }
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      return new Response(JSON.stringify({ error: 'Failed to fetch file from source.' }), { status: 500 });
    }
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition);
    }
    return new Response(response.body, { status: 200, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Proxy error: ' + err.message }), { status: 500 });
  }
} 