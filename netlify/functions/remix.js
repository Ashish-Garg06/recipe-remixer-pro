export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    if (!process.env.HF_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "HF_API_KEY missing in environment" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt missing" }),
      };
    }

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
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

    const text = await hfResponse.text();

    if (!hfResponse.ok) {
      return {
        statusCode: hfResponse.status,
        body: JSON.stringify({
          error: "Hugging Face error",
          status: hfResponse.status,
          details: text,
        }),
      };
    }

    return {
      statusCode: 200,
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function crashed",
        message: err.message,
      }),
    };
  }
}
