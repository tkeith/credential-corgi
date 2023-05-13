import { myStringify } from "@/utils";
import { existsSync, readFileSync, writeFileSync } from "fs";
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

function getDb(key: string): any[] {
  if (!existsSync(`db-${key}.json`)) {
    return [];
  }
  const db = readFileSync(`db-${key}.json`).toString();
  return JSON.parse(db);
}

function saveDb(key: string, data: any) {
  const dataString = myStringify(data);
  writeFileSync(`db-${key}.json`, dataString);
}

export async function POST(request: Request) {
  const jsonIn = await request.json();

  let jsonOut: any = {};

  if (jsonIn.action == "generate-credential-structure") {
    jsonOut.structure = await generateCredentialStructure(jsonIn.prompt);
  }

  if (jsonIn.action == "save-credential-structure") {
    await saveCredentialStructure(jsonIn.fullkey, jsonIn.structure);
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

const saveCredentialStructure = async (fullkey: string, structure: string) => {
  const db = getDb("credential-structure");

  if (db.some((item) => item.fullkey == fullkey)) {
    return;
  }

  db.push({
    fullkey: fullkey,
    structure: structure,
  });

  saveDb("credential-structure", db);
};
