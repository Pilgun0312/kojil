import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") || "JP";
  const categories = await prisma.category.findMany({
    where: { jobs: { some: { country } } },
    include: { _count: { select: { jobs: { where: { country } } } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}
