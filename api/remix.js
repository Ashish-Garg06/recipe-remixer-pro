export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const hfResponse = await fetch(
      "https://router.huggingface.co/v1/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 700,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await hfResponse.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
}
