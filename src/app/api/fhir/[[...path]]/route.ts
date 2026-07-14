import { NextRequest, NextResponse } from "next/server";

// Generic reverse proxy to the local HAPI FHIR server.
// Keeps the FHIR base URL server-side only, and avoids CORS entirely since
// the browser only ever talks to same-origin /api/fhir/*.

const FHIR_BASE_URL = process.env.FHIR_BASE_URL ?? "http://localhost:8080/fhir";

async function proxy(req: NextRequest, path: string[] | undefined) {
  const targetPath = path?.join("/") ?? "";
  const search = req.nextUrl.search; // includes leading "?" if present
  // Bare POST (no sub-path) is how FHIR transaction/batch Bundles are submitted.
  const url = targetPath ? `${FHIR_BASE_URL}/${targetPath}${search}` : `${FHIR_BASE_URL}${search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/fhir+json",
      Accept: "application/fhir+json",
    },
  };

  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    init.body = await req.text();
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, init);
  } catch (err) {
    return NextResponse.json(
      {
        resourceType: "OperationOutcome",
        issue: [
          {
            severity: "error",
            code: "transient",
            diagnostics: `Could not reach FHIR server at ${FHIR_BASE_URL}. Is the local HAPI/docker-compose stack running? (${
              err instanceof Error ? err.message : String(err)
            })`,
          },
        ],
      },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/fhir+json",
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params.path);
}
export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params.path);
}
export async function PUT(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params.path);
}
export async function DELETE(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params.path);
}
export async function PATCH(req: NextRequest, { params }: { params: { path?: string[] } }) {
  return proxy(req, params.path);
}
