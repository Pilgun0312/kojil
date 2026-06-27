import "dotenv/config";
import * as cheerio from "cheerio";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "https://jp.indeed.com/jobs?q=%E5%A4%96%E5%9B%BD%E4%BA%BA&start=";
const PAGES_TO_SCRAPE = 5; // 15 jobs per page ≈ 75 jobs

// Map Japanese location text to our prefecture keys
const PREFECTURE_MAP: Record<string, string> = {
  "東京": "東京", "大阪": "大阪", "名古屋": "名古屋", "横浜": "横浜",
  "福岡": "福岡", "札幌": "札幌", "神戸": "神戸", "京都": "京都",
  "広島": "広島", "仙台": "仙台", "千葉": "千葉", "埼玉": "埼玉",
  "北海道": "北海道", "愛知": "愛知", "静岡": "静岡", "茨城": "茨城",
  "群馬": "群馬", "栃木": "栃木", "長野": "長野", "新潟": "新潟",
  "三重": "三重", "岐阜": "岐阜", "富山": "富山", "石川": "石川",
  "熊本": "熊本", "鹿児島": "鹿児島", "沖縄": "沖縄",
  "神奈川": "横浜", "兵庫": "神戸", "滋賀": "愛知",
  "奈良": "大阪", "和歌山": "大阪", "山梨": "東京",
  "長崎": "福岡", "大分": "福岡", "佐賀": "福岡", "宮崎": "熊本",
  "山口": "広島", "岡山": "広島", "鳥取": "広島", "島根": "広島",
  "香川": "大阪", "徳島": "大阪", "愛媛": "大阪", "高知": "大阪",
  "福島": "仙台", "宮城": "仙台", "山形": "仙台", "岩手": "仙台",
  "秋田": "仙台", "青森": "仙台", "福井": "石川",
};

function mapLocation(text: string): string {
  for (const [key, value] of Object.entries(PREFECTURE_MAP)) {
    if (text.includes(key)) return value;
  }
  return "東京"; // default
}

function parseSalary(text: string): { min: number; max: number; type: string } {
  const cleaned = text.replace(/,/g, "").replace(/円/g, "").replace(/以上/g, "").trim();

  // Monthly (月給)
  if (text.includes("月給") || text.includes("月")) {
    // Handle "20万円 ~ 27万円" format
    const manMatch = cleaned.match(/(\d+(?:\.\d+)?)万.*?(\d+(?:\.\d+)?)万/);
    if (manMatch) {
      return { min: Math.round(parseFloat(manMatch[1]) * 10000), max: Math.round(parseFloat(manMatch[2]) * 10000), type: "FULL_TIME" };
    }
    // Handle "200,000 ~ 300,000" format
    const numMatch = cleaned.match(/(\d{3,})\D*?(\d{3,})/);
    if (numMatch) {
      return { min: parseInt(numMatch[1]), max: parseInt(numMatch[2]), type: "FULL_TIME" };
    }
    // Single value "28.5万円"
    const singleMan = cleaned.match(/(\d+(?:\.\d+)?)万/);
    if (singleMan) {
      const val = Math.round(parseFloat(singleMan[1]) * 10000);
      return { min: val, max: val, type: "FULL_TIME" };
    }
    // Single number
    const singleNum = cleaned.match(/(\d{5,})/);
    if (singleNum) {
      const val = parseInt(singleNum[1]);
      return { min: val, max: val, type: "FULL_TIME" };
    }
  }

  // Hourly (時給)
  if (text.includes("時給") || text.includes("時")) {
    const rangeMatch = cleaned.match(/(\d{3,})\D*?(\d{3,})/);
    if (rangeMatch) {
      const minH = parseInt(rangeMatch[1]);
      const maxH = parseInt(rangeMatch[2]);
      return { min: minH * 8 * 22, max: maxH * 8 * 22, type: "PART_TIME" };
    }
    const singleMatch = cleaned.match(/(\d{3,})/);
    if (singleMatch) {
      const hourly = parseInt(singleMatch[1]);
      const monthly = hourly * 8 * 22;
      return { min: monthly, max: monthly, type: "PART_TIME" };
    }
  }

  // Daily (日給)
  if (text.includes("日給") || text.includes("日")) {
    const match = cleaned.match(/(\d{4,})/);
    if (match) {
      const daily = parseInt(match[1]);
      return { min: daily * 22, max: daily * 22, type: "FULL_TIME" };
    }
  }

  // Yearly (年収)
  if (text.includes("年収") || text.includes("年")) {
    const match = cleaned.match(/(\d+)万/);
    if (match) {
      const yearly = parseInt(match[1]) * 10000;
      return { min: Math.round(yearly / 12), max: Math.round(yearly / 12), type: "FULL_TIME" };
    }
  }

  return { min: 200000, max: 250000, type: "FULL_TIME" };
}

// Category detection from Japanese job titles
function detectCategory(title: string, snippet: string): string {
  const text = title + " " + snippet;
  if (/製造|工場|半導体|組立|検査|検品|部品|オペレーター|機械/.test(text)) return "Үйлдвэрлэл, Угсралт";
  if (/建設|建築|施工|土木/.test(text)) return "Барилга";
  if (/物流|配達|配送|倉庫|ピッキング|仕分/.test(text)) return "Логистик, Агуулах";
  if (/食品|製菓|パン|ベーカリー/.test(text)) return "Хүнсний үйлдвэрлэл";
  if (/農業|農園|畑|収穫/.test(text)) return "Хөдөө аж ахуй";
  if (/水産|魚|漁/.test(text)) return "Загас боловсруулалт";
  if (/縫製|アパレル|ファッション|服/.test(text)) return "Нэхмэл, Хувцас";
  if (/清掃|クリーニング|ハウスキーピング/.test(text)) return "Цэвэрлэгээ, Үйлчилгээ";
  if (/レストラン|飲食|キッチン|ホール|調理|ホテル|コンビニ|店|カフェ|居酒屋|ラーメン|蕎麦|焼肉|寿司/.test(text)) return "Зочид буудал, Хоол";
  if (/運転|ドライバー|タクシー/.test(text)) return "Тээвэр, Жолоодлого";
  if (/IT|プログラ|エンジニア|SE|システム/.test(text)) return "IT, Технологи";
  if (/通訳|翻訳|事務|オフィス|販売/.test(text)) return "Орчуулга, Оффис";
  return "Үйлдвэрлэл, Угсралт";
}

// Job type mapping
function mapJobType(text: string): string {
  if (/アルバイト|パート/.test(text)) return "PART_TIME";
  if (/契約/.test(text)) return "CONTRACT";
  if (/派遣/.test(text)) return "CONTRACT";
  if (/正社員/.test(text)) return "FULL_TIME";
  return "FULL_TIME";
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ja-JP,ja;q=0.9",
      "Accept": "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  salary: string;
  snippet: string;
  jobType: string;
  url: string;
}

async function scrapeListPage(startIndex: number): Promise<ScrapedJob[]> {
  const html = await fetchPage(BASE_URL + startIndex);
  const $ = cheerio.load(html);
  const jobs: ScrapedJob[] = [];

  // Indeed uses various selectors for job cards
  $(".job_seen_beacon, .result, [data-jk]").each((_, el) => {
    const $el = $(el);
    const title = $el.find("h2 a, .jobTitle a, [id^='jobTitle'] a, h2 span").first().text().trim()
      || $el.find("h2").first().text().trim();
    const company = $el.find("[data-testid='company-name'], .companyName, .company").first().text().trim();
    const location = $el.find("[data-testid='text-location'], .companyLocation, .location").first().text().trim();
    const salary = $el.find("[data-testid='attribute_snippet_testid'], .salary-snippet, .metadata .attribute_snippet").first().text().trim();
    const snippet = $el.find(".job-snippet, [class*='snippet'], td.snip").first().text().trim();
    const jobType = $el.find("[data-testid='attribute_snippet_testid'], .metadata").text();

    // Get job URL
    const linkEl = $el.find("h2 a, .jobTitle a, [id^='jobTitle'] a").first();
    const href = linkEl.attr("href") || "";
    const jk = $el.attr("data-jk") || "";
    const url = jk ? `https://jp.indeed.com/viewjob?jk=${jk}` :
      (href.startsWith("http") ? href : href ? `https://jp.indeed.com${href}` : "");

    if (title && title.length > 2) {
      jobs.push({ title, company: company || "Indeed Japan企業", location, salary, snippet, jobType, url });
    }
  });

  // If structured selectors didn't work, try text extraction
  if (jobs.length === 0) {
    // Fallback: look for any links with job-like content
    $("a").each((_, el) => {
      const $el = $(el);
      const href = $el.attr("href") || "";
      if (href.includes("/rc/clk") || href.includes("viewjob")) {
        const title = $el.text().trim();
        if (title && title.length > 5 && title.length < 200) {
          const $parent = $el.closest("div, li, td");
          jobs.push({
            title,
            company: "Indeed Japan企業",
            location: "",
            salary: "",
            snippet: $parent.text().substring(0, 200),
            jobType: "",
            url: href.startsWith("http") ? href : `https://jp.indeed.com${href}`,
          });
        }
      }
    });
  }

  // Deduplicate
  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = j.title + j.company;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  console.log("🇯🇵 Indeed Japan スクレイピング開始 (外国人)...\n");

  // Get or create categories
  const categoryMap: Record<string, string> = {};
  const catNames = [
    "Үйлдвэрлэл, Угсралт", "Барилга", "Логистик, Агуулах",
    "Хүнсний үйлдвэрлэл", "Хөдөө аж ахуй", "Загас боловсруулалт",
    "Нэхмэл, Хувцас", "Цэвэрлэгээ, Үйлчилгээ", "Зочид буудал, Хоол",
    "Тээвэр, Жолоодлого", "IT, Технологи", "Орчуулга, Оффис",
  ];
  for (const name of catNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) cat = await prisma.category.create({ data: { name, icon: "Wrench" } });
    categoryMap[name] = cat.id;
  }

  let totalInserted = 0;

  for (let page = 0; page < PAGES_TO_SCRAPE; page++) {
    const startIndex = page * 10;
    console.log(`📄 Page ${page + 1} (start=${startIndex}) скрэйп хийж байна...`);

    try {
      const listings = await scrapeListPage(startIndex);
      console.log(`   ${listings.length} зар олдлоо`);

      for (const job of listings) {
        try {
          const locationKey = mapLocation(job.location);
          const parsed = parseSalary(job.salary);
          const catName = detectCategory(job.title, job.snippet);
          const categoryId = categoryMap[catName] || categoryMap["Үйлдвэрлэл, Угсралт"];
          const jobType = mapJobType(job.jobType || job.title);

          // Find or create company
          const companyName = job.company || "Indeed Japan企業";
          let company = await prisma.company.findFirst({ where: { name: companyName, country: "JP" } });
          if (!company) {
            company = await prisma.company.create({
              data: {
                name: companyName,
                country: "JP",
                location: locationKey,
                industry: "Indeed Japan",
                description: `Indeed Japan-с авсан ажлын зар`,
              },
            });
          }

          const description = job.snippet
            ? `${job.snippet}\n\n🔗 Дэлгэрэнгүй: ${job.url}`
            : `Indeed Japan дээрх ажлын зар. Гадаадын иргэд ажиллах боломжтой.\n\n🔗 Дэлгэрэнгүй: ${job.url}`;

          await prisma.job.create({
            data: {
              title: job.title,
              description,
              requirements: ["外国人可 (Гадаадын иргэд боломжтой)", "学歴不問 (Боловсролын шаардлагагүй)"],
              responsibilities: ["Ажлын байранд очиж мэдэгдэнэ"],
              benefits: ["社会保険完備 (4 даатгал)", "交通費支給 (Тээврийн зардал)"],
              salaryMin: parsed.min,
              salaryMax: parsed.max,
              currency: "JPY",
              country: "JP",
              location: locationKey,
              type: jobType,
              mode: "ONSITE",
              experience: "ENTRY",
              companyId: company.id,
              categoryId,
            },
          });

          totalInserted++;
          console.log(`   ✓ ${job.title.substring(0, 50)}...`);
        } catch (err) {
          console.error(`   ✗ Алдаа: ${(err as Error).message?.substring(0, 80)}`);
        }
      }
    } catch (err) {
      console.error(`   ✗ Page error: ${(err as Error).message?.substring(0, 80)}`);
    }

    // Delay between pages
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n✅ Дууслаа! ${totalInserted} Япон дахь ажлын зар нэмэгдлээ.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
