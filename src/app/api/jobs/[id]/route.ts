import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: { company: true, category: true, _count: { select: { applications: true } } },
  });
  return NextResponse.json(job);
}
