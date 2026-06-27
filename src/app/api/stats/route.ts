import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") || "JP";
  const [jobs, companies, categories] = await Promise.all([
    prisma.job.count({ where: { country } }),
    prisma.company.count({ where: { country } }),
    prisma.category.count({ where: { jobs: { some: { country } } } }),
  ]);
  return NextResponse.json({ jobs, companies, categories });
}
