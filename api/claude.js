export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const hasKey = !!process.env.ANTHROPIC_API_KEY;
    const keyPrefix = process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0,10) : 'MISSING';
    const bodyType = typeof req.body;
    const model = req.body && req.body.model;
    console.log('DIAG hasKey=' + hasKey + ' keyPrefix=' + keyPrefix + ' bodyType=' + bodyType + ' model=' + model);

    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('ERR status=' + response.status + ' msg=' + (data.error && data.error.message));
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error('CATCH ' + err.message);
    res.status(500).json({ error: 'API call failed', details: err.message });
  }
}