import { myStringify } from "@/utils";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";
import * as openailib from "openai";

const GENERATE_STRUCTURE_PROMPT = readFileSync(
  "prompts/generate-structure.md"
).toString();

const openai = new openailib.OpenAIApi(
  new openailib.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export async function POST(request: Request) {
  const jsonIn = await request.json();

  let jsonOut: any = {
    message: "Hello World",
  };

  if (jsonIn.action == "generate-credential-structure") {
    jsonOut.structure = await generateCredentialStructure(jsonIn.prompt);
  }

  return NextResponse.json(jsonOut);
}

const generateCredentialStructure = async (prompt: string) => {
  const chat = await openai.createChatCompletion({
    model: "gpt-4",
    temperature: 0.3,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    messages: [
      {
        role: "system",
        content: GENERATE_STRUCTURE_PROMPT,
      },
      { role: "user", content: prompt },
    ],
  });
  const result = chat.data.choices[0]?.message!.content;

  return result;
};
