import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'signal-os-web',
    ts: new Date().toISOString(),
    slo: {
      apiAvailabilityTarget: 99.9,
      p95ResponseMsTarget: 400,
    },
  });
}
