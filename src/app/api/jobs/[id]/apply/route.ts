import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const application = await prisma.application.create({
    data: { ...body, jobId: id },
  });
  return NextResponse.json(application, { status: 201 });
}
