import { NextResponse } from "next/server";

export async function POST(request: Request) {

  const data = {
    message: "Hello World",
  };

  return NextResponse.json({ data });
}
