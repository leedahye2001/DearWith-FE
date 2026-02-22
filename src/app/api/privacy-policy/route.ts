import { NextResponse } from "next/server";

const PRIVACY_URL = process.env.PRIVACY_POLICY_URL;

export async function GET() {
  if (!PRIVACY_URL) {
    return NextResponse.json(
      { error: "Privacy policy URL not configured" },
      { status: 500 }
    );
  }
  try {
    const res = await fetch(PRIVACY_URL, {
      headers: { Accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch privacy document" },
        { status: res.status }
      );
    }
    const html = await res.text();
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch privacy document" },
      { status: 500 }
    );
  }
}
