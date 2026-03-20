export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages } = req.body;
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Missing MISTRAL_API_KEY environment variable' });
      return;
    }

    // Mistral API expects messages in the format: [{role: "user", content: "..."}, ...]
    // The incoming messages from the frontend already match this.

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || `Mistral API error: ${response.statusText}`
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response from model';

    res.status(200).json({ reply });

  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
