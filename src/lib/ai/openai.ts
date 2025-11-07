import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeNote(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes notes concisely. Provide a brief summary in 2-3 sentences.",
        },
        {
          role: "user",
          content: `Summarize this note:\n\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || "Unable to generate summary";
  } catch (error) {
    console.error("OpenAI summarize error:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function improveNote(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that improves note content by fixing grammar, enhancing clarity, and maintaining the original meaning. Return only the improved version.",
        },
        {
          role: "user",
          content: `Improve this note:\n\n${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("OpenAI improve error:", error);
    throw new Error("Failed to improve note");
  }
}

export async function generateTags(content: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates relevant tags for notes. Return only a comma-separated list of 3-5 single-word tags, no explanations.",
        },
        {
          role: "user",
          content: `Generate tags for this note:\n\n${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 50,
    });

    const tagsString = response.choices[0]?.message?.content || "";
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5);

    return tags;
  } catch (error) {
    console.error("OpenAI tags error:", error);
    throw new Error("Failed to generate tags");
  }
}