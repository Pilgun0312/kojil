import "dotenv/config";
import * as cheerio from "cheerio";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SEARCH_URL = "https://www.albamon.com/total-search?keyword=%EC%99%B8%EA%B5%AD%EC%9D%B8%EA%B0%80%EB%8A%A5&page=";
const DETAIL_URL = "https://www.albamon.com/jobs/detail/";
const PAGES_TO_SCRAPE = 3; // scrape 3 pages (about 60 jobs)

// Map Korean region names to our prefecture keys
const REGION_MAP: Record<string, string> = {
  "서울": "서울", "부산": "부산", "대구": "대구", "인천": "인천",
  "광주": "광주", "대전": "대전", "울산": "울산", "세종": "세종",
  "경기": "경기도", "강원": "강원도",
  "충북": "충청북도", "충남": "충청남도", "충청북": "충청북도", "충청남": "충청남도",
  "전북": "전북", "전남": "전라남도", "전라북": "전북", "전라남": "전라남도",
  "경북": "경상북도", "경남": "경상남도", "경상북": "경상북도", "경상남": "경상남도",
  "제주": "제주도",
};

function mapLocation(locationText: string): string {
  for (const [key, value] of Object.entries(REGION_MAP)) {
    if (locationText.includes(key)) return value;
  }
  return "서울"; // default
}

function parseSalary(salaryText: string): { min: number; max: number; type: string } {
  const cleaned = salaryText.replace(/,/g, "").replace(/원/g, "").trim();

  // Monthly salary (월급)
  if (salaryText.includes("월급") || salaryText.includes("월")) {
    const match = cleaned.match(/(\d{1,3}(?:\d{3})*)/);
    if (match) {
      const amount = parseInt(match[1]);
      return { min: amount, max: amount, type: "FULL_TIME" };
    }
  }

  // Hourly (시급)
  if (salaryText.includes("시급") || salaryText.includes("시")) {
    const match = cleaned.match(/(\d{1,3}(?:\d{3})*)/);
    if (match) {
      const hourly = parseInt(match[1]);
      // Estimate monthly: hourly * 8h * 22 days
      const monthly = hourly * 8 * 22;
      return { min: monthly, max: monthly, type: "PART_TIME" };
    }
  }

  // Daily (일급)
  if (salaryText.includes("일급") || salaryText.includes("일")) {
    const match = cleaned.match(/(\d{1,3}(?:\d{3})*)/);
    if (match) {
      const daily = parseInt(match[1]);
      // Estimate monthly: daily * 22 days
      const monthly = daily * 22;
      return { min: monthly, max: monthly, type: "FULL_TIME" };
    }
  }

  // Yearly (연봉)
  if (salaryText.includes("연봉") || salaryText.includes("연")) {
    const match = cleaned.match(/(\d{1,3}(?:\d{3})*)/);
    if (match) {
      const yearly = parseInt(match[1]);
      const monthly = Math.round(yearly / 12);
      return { min: monthly, max: monthly, type: "FULL_TIME" };
    }
  }

  // Just a number
  const match = cleaned.match(/(\d{1,3}(?:\d{3})*)/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[1]), type: "FULL_TIME" };
  }

  return { min: 2000000, max: 2500000, type: "FULL_TIME" };
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });
  return res.text();
}

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  detailUrl: string;
}

async function scrapeListPage(page: number): Promise<ScrapedJob[]> {
  const html = await fetchPage(SEARCH_URL + page);
  const $ = cheerio.load(html);
  const jobs: ScrapedJob[] = [];

  // Find all job listing links
  $('a[href*="/jobs/detail/"]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href") || "";
    const title = $el.text().trim();

    if (!href.includes("/jobs/detail/") || !title || title.length < 3) return;

    // Get the parent container for additional info
    const $parent = $el.closest("li") || $el.parent();
    const parentText = $parent.text();

    // Extract location from parent text
    let location = "";
    const locationPatterns = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "충청", "전북", "전남", "전라", "경북", "경남", "경상", "제주"];
    for (const pat of locationPatterns) {
      if (parentText.includes(pat)) {
        location = pat;
        break;
      }
    }

    // Extract salary from parent text
    let salary = "";
    const salaryMatch = parentText.match(/(월급|시급|일급|연봉|주급)\s*[\d,]+\s*원?/);
    if (salaryMatch) {
      salary = salaryMatch[0];
    } else {
      const numMatch = parentText.match(/[\d,]{5,}원/);
      if (numMatch) salary = numMatch[0];
    }

    const fullUrl = href.startsWith("http") ? href : `https://www.albamon.com${href}`;
    // Extract just the detail URL without query params
    const detailMatch = fullUrl.match(/(https:\/\/www\.albamon\.com\/jobs\/detail\/\d+)/);
    const detailUrl = detailMatch ? detailMatch[1] : fullUrl.split("?")[0];

    jobs.push({ title, company: "", location, salary, detailUrl });
  });

  // Deduplicate by URL
  const seen = new Set<string>();
  return jobs.filter((j) => {
    if (seen.has(j.detailUrl)) return false;
    seen.add(j.detailUrl);
    return true;
  });
}

async function scrapeDetailPage(url: string): Promise<{
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
}> {
  try {
    const html = await fetchPage(url);
    const $ = cheerio.load(html);
    const text = $("body").text();

    // Extract company name
    let company = "";
    const companyEl = $('span:contains("기업명"), dt:contains("기업명")').next();
    if (companyEl.length) {
      company = companyEl.text().trim();
    }
    if (!company) {
      // Try meta tags or title
      const titleEl = $("title").text();
      const parts = titleEl.split("|").map((s) => s.trim());
      if (parts.length > 1) company = parts[1];
    }

    // Extract location
    let location = "";
    const locationPatterns = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "충청", "전북", "전남", "전라", "경북", "경남", "경상", "제주"];
    for (const pat of locationPatterns) {
      if (text.includes(pat)) {
        location = pat;
        break;
      }
    }

    // Extract salary
    let salary = "";
    const salaryMatch = text.match(/(월급|시급|일급|연봉|주급)\s*[\d,]+\s*원?/);
    if (salaryMatch) salary = salaryMatch[0];

    // Extract job description
    let description = "";
    const descEl = $('[class*="detail"], [class*="content"], [class*="info"]').first();
    if (descEl.length) {
      description = descEl.text().trim().substring(0, 500);
    }

    // Extract benefits
    const benefitsList: string[] = [];
    const benefitKeywords = ["국민연금", "고용보험", "산재보험", "건강보험", "중식", "석식", "교통비", "기숙사", "4대보험", "퇴직금", "야간수당", "연장수당"];
    for (const kw of benefitKeywords) {
      if (text.includes(kw)) benefitsList.push(kw);
    }

    return {
      title: $("h1, h2").first().text().trim() || "",
      company,
      location,
      salary,
      description,
      requirements: ["외국인 가능", "학력 무관"],
      benefits: benefitsList.length > 0 ? benefitsList : ["4대보험"],
    };
  } catch {
    return {
      title: "", company: "", location: "", salary: "",
      description: "", requirements: ["외국인 가능"], benefits: ["4대보험"],
    };
  }
}

async function main() {
  console.log("🔍 Albamon 스크래핑 시작 (외국인가능)...\n");

  // Ensure we have a catch-all category for scraped jobs
  let category = await prisma.category.findFirst({ where: { name: "Үйлдвэрлэл, Угсралт" } });
  if (!category) {
    category = await prisma.category.create({ data: { name: "Үйлдвэрлэл, Угсралт", icon: "Wrench" } });
  }

  // Also get/create other useful categories
  const categoryMap: Record<string, string> = {};
  const categoryNames = [
    "Үйлдвэрлэл, Угсралт", "Барилга", "Логистик, Агуулах",
    "Хүнсний үйлдвэрлэл", "Зочид буудал, Хоол", "Цэвэрлэгээ, Үйлчилгээ",
    "Нэхмэл, Хувцас", "Тээвэр, Жолоодлого", "Орчуулга, Оффис",
  ];
  for (const name of categoryNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) cat = await prisma.category.create({ data: { name, icon: "Wrench" } });
    categoryMap[name] = cat.id;
  }

  // Category detection keywords
  function detectCategory(title: string, description: string): string {
    const text = (title + " " + description).toLowerCase();
    if (text.includes("건설") || text.includes("건축") || text.includes("바릴가")) return categoryMap["Барилга"];
    if (text.includes("물류") || text.includes("택배") || text.includes("포장") || text.includes("창고") || text.includes("배송")) return categoryMap["Логистик, Агуулах"];
    if (text.includes("식품") || text.includes("과일") || text.includes("식당") || text.includes("주방") || text.includes("요리") || text.includes("호텔")) return categoryMap["Зочид буудал, Хоол"];
    if (text.includes("봉제") || text.includes("의류") || text.includes("섬유") || text.includes("재봉")) return categoryMap["Нэхмэл, Хувцас"];
    if (text.includes("운전") || text.includes("운송") || text.includes("지게차")) return categoryMap["Тээвэр, Жолоодлого"];
    if (text.includes("통역") || text.includes("번역") || text.includes("사무")) return categoryMap["Орчуулга, Оффис"];
    if (text.includes("청소") || text.includes("세척") || text.includes("미화")) return categoryMap["Цэвэрлэгээ, Үйлчилгээ"];
    return categoryMap["Үйлдвэрлэл, Угсралт"]; // default
  }

  let totalInserted = 0;

  for (let page = 1; page <= PAGES_TO_SCRAPE; page++) {
    console.log(`📄 ${page}-р хуудас скрэйп хийж байна...`);
    const listings = await scrapeListPage(page);
    console.log(`   ${listings.length} зар олдлоо`);

    for (const listing of listings) {
      try {
        // Fetch detail page for more info
        console.log(`   → ${listing.title.substring(0, 40)}...`);
        const detail = await scrapeDetailPage(listing.detailUrl);

        // Use detail data or fall back to list data
        const title = detail.title || listing.title;
        const companyName = detail.company || listing.company || "Albamon компани";
        const locationKey = mapLocation(detail.location || listing.location);
        const salaryText = detail.salary || listing.salary;
        const parsed = parseSalary(salaryText);

        // Find or create company
        let company = await prisma.company.findFirst({ where: { name: companyName } });
        if (!company) {
          company = await prisma.company.create({
            data: {
              name: companyName,
              location: locationKey,
              industry: "Albamon",
              description: `Albamon.com-с авсан ажлын зар`,
            },
          });
        }

        // Detect category
        const categoryId = detectCategory(title, detail.description);

        // Create job - translate title pattern to include Mongolian context
        const mnDescription = detail.description
          ? `${detail.description}\n\n🔗 Дэлгэрэнгүй: ${listing.detailUrl}`
          : `Albamon.com дээрх ажлын зар. Гадаадын иргэд ажиллах боломжтой.\n\n🔗 Дэлгэрэнгүй: ${listing.detailUrl}`;

        await prisma.job.create({
          data: {
            title,
            description: mnDescription,
            requirements: detail.requirements.length > 0 ? detail.requirements : ["외국인 가능 (Гадаадын иргэд боломжтой)"],
            responsibilities: ["Ажлын байранд очиж мэдэгдэнэ"],
            benefits: detail.benefits.map((b) => {
              const translations: Record<string, string> = {
                "국민연금": "Тэтгэврийн даатгал",
                "고용보험": "Ажилгүйдлийн даатгал",
                "산재보험": "Үйлдвэрлэлийн ослын даатгал",
                "건강보험": "Эрүүл мэндийн даатгал",
                "중식": "Үдийн хоол",
                "석식": "Оройн хоол",
                "교통비": "Тээврийн зардал",
                "기숙사": "Байр өгнө",
                "4대보험": "4 даатгал",
                "퇴직금": "Тэтгэмж",
                "야간수당": "Шөнийн нэмэгдэл",
                "연장수당": "Илүү цагийн нэмэгдэл",
              };
              return translations[b] || b;
            }),
            salaryMin: parsed.min,
            salaryMax: parsed.max,
            currency: "KRW",
            location: locationKey,
            type: parsed.type,
            mode: "ONSITE",
            experience: "ENTRY",
            companyId: company.id,
            categoryId,
          },
        });

        totalInserted++;

        // Small delay to avoid hammering the server
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`   ✗ Алдаа: ${(err as Error).message?.substring(0, 80)}`);
      }
    }

    // Delay between pages
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✅ Дууслаа! ${totalInserted} ажлын зар нэмэгдлээ.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
