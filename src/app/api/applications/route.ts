import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json([]);
  const applications = await prisma.application.findMany({
    where: { email },
    include: { job: { include: { company: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}
