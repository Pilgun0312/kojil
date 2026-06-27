import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const mode = searchParams.get("mode") || "";
  const experience = searchParams.get("experience") || "";
  const salaryMin = searchParams.get("salaryMin");
  const salaryMax = searchParams.get("salaryMax");

  const country = searchParams.get("country") || "JP";

  const where: Record<string, unknown> = { country };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { company: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (category) where.categoryId = category;
  if (type) where.type = type;
  if (mode) where.mode = mode;
  if (experience) where.experience = experience;
  if (salaryMin) where.salaryMin = { gte: parseInt(salaryMin) };
  if (salaryMax) where.salaryMax = { lte: parseInt(salaryMax) };

  const jobs = await prisma.job.findMany({
    where,
    include: { company: true, category: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const job = await prisma.job.create({
    data: body,
    include: { company: true, category: true },
  });
  return NextResponse.json(job, { status: 201 });
}
