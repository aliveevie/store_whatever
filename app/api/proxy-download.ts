import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Missing or invalid url' });
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(500).json({ error: 'Failed to fetch file from source.' });
      return;
    }
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      res.setHeader('Content-Disposition', contentDisposition);
    }
    res.setHeader('Content-Type', contentType);
    // Stream the file
    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error: ' + (err as Error).message });
  }
} 