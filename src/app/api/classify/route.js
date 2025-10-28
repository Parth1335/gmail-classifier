import OpenAI from "openai";

const openAiKey = localStorage.getItem("openai_api_key");

const client = new OpenAI({
  apiKey: openAiKey,
});

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const openAiKey = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!openAiKey) {
      return Response.json(
        { error: "Missing OpenAI API key in request" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: openAiKey,
    });

    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails)) {
      return Response.json(
        { error: "Invalid or missing email data" },
        { status: 400 }
      );
    }
    const summaries = emails.map(
      (email, i) => `${i + 1}. ${email.snippet || "No content"}`
    );

    const prompt = `
Classify each email into one of these categories:
["Important", "Promotions", "Updates", "Work", "Spam", "Others"].

Return a **pure JSON array** (no backticks or text) like:
[
  { "index": 1, "category": "Work" },
  { "index": 2, "category": "Spam" }
]

Emails:
${summaries.join("\n")}
`;

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const raw = completion.output_text || "";

    let parsed = [];
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      console.warn("Model output not JSON — using fallback");
      parsed = emails.map((_, i) => ({
        index: i + 1,
        category: "Others",
      }));
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Error in /api/classify:", error);
    return Response.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
