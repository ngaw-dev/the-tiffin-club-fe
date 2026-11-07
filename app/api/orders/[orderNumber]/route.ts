import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{ orderNumber: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;

  let upstream: Response;
  try {
    upstream = await fetch(
      `${getApiBaseUrl()}/orders/${encodeURIComponent(orderNumber)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
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
