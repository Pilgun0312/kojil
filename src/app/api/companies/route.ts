import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") || "JP";
  const companies = await prisma.company.findMany({
    where: { country },
    include: { _count: { select: { jobs: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(companies);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const company = await prisma.company.create({ data: body });
  return NextResponse.json(company, { status: 201 });
}
