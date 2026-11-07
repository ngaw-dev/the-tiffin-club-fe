import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body.", errors: null, status: 400 },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBaseUrl()}/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? `Could not reach the backend API: ${error.message}`
            : "Could not reach the backend API.",
        errors: null,
        status: 502,
      },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let json: unknown = null;
  try {
    json = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    json = { message: text || "Upstream error", errors: null, status: upstream.status };
  }

  return NextResponse.json(json, { status: upstream.status });
}
