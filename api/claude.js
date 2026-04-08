export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Manually parse body in case Vercel ESM compilation breaks auto-parsing
    let parsedBody = req.body;
    if (!parsedBody || typeof parsedBody !== 'object') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      parsedBody = JSON.parse(Buffer.concat(chunks).toString());
    }

    console.log('DIAG hasKey=' + !!process.env.ANTHROPIC_API_KEY + ' bodyType=' + typeof parsedBody + ' model=' + parsedBody.model);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(parsedBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('ERR ' + response.status + ' type=' + (data.error && data.error.type) + ' msg=' + (data.error && data.error.message));
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error('CATCH ' + err.message);
    res.status(500).json({ error: 'API call failed', details: err.message });
  }
}