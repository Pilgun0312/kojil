import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json([]);
  const saved = await prisma.savedJob.findMany({
    where: { sessionId },
    include: { job: { include: { company: true, category: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const { sessionId, jobId } = await req.json();
  const existing = await prisma.savedJob.findUnique({ where: { sessionId_jobId: { sessionId, jobId } } });
  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.savedJob.create({ data: { sessionId, jobId } });
  return NextResponse.json({ saved: true });
}
