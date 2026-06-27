import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [jobs, companies, categories] = await Promise.all([
    prisma.job.count(),
    prisma.company.count(),
    prisma.category.count(),
  ]);
  return NextResponse.json({ jobs, companies, categories });
}
