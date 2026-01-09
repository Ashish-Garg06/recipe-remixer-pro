export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a professional chef and nutritionist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    return res.status(200).json({
      text: data.choices[0].message.content,
    });

  } catch (err) {
    console.error("GROQ ERROR:", err);
    return res.status(500).json({ error: "Groq request failed" });
  }
}
