import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Data scraped from jp.indeed.com - keyword: 外国人歓迎
const JOBS_DATA = [
  // Page 1 - 外国人歓迎
  { title: "工場内作業（タオル・衣類たたみ）", company: "有限会社エイトー", location: "愛知", salary: "時給 1150", type: "PART_TIME", snippet: "仕上がったタオルや衣類を手順通りにたたむ作業。未経験OK。週2・3日からOK。シフト自由。外国人歓迎。", contact: { name: "川田 修久（代表取締役）", phone: "052-805-2369" } },
  { title: "会員制リゾートホテル 夏限定サービススタッフ", company: "株式会社ホテルジャパン", location: "静岡", salary: "時給 1300", type: "PART_TIME", snippet: "夏季限定アルバイト。オーシャンビューのリゾートで接客業務。外国人歓迎。", contact: { name: "採用担当", phone: "" } },
  { title: "居酒屋のホール・キッチン正社員（稲毛）", company: "鳥貴族｜ジェイエフエフシステムズ株式会社", location: "千葉", salary: "月給 283815-328931", type: "FULL_TIME", snippet: "外国籍の方も歓迎。未経験月28万円以上。職歴不問。居酒屋チェーンの正社員。", contact: { name: "採用担当", phone: "" } },
  { title: "エンジン部品の製造組立て（寮費全額補助）", company: "UTエイム株式会社", location: "愛知", salary: "月給 300000-416000", type: "CONTRACT", snippet: "外国人の方も活躍している職場。2交代制。寮費全額補助。未経験歓迎。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },
  { title: "居酒屋のホール・キッチン正社員（泉佐野）", company: "鳥貴族｜ジェイエフエフシステムズ株式会社", location: "大阪", salary: "月給 283815-328931", type: "FULL_TIME", snippet: "外国籍の方も歓迎。未経験OK。職歴不問。社員登用あり。", contact: { name: "採用担当", phone: "" } },
  { title: "自動車部品加工オペレーター", company: "UTエイム株式会社", location: "神奈川", salary: "月給 230000-324000", type: "CONTRACT", snippet: "外国人の方も活躍。面接なしで入社可能。2交代制。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },
  { title: "ハンバーグ店のホール・キッチンスタッフ（渋谷）", company: "BWコンサルティング株式会社 挽き肉のトリコ渋谷店", location: "東京", salary: "月給 320000", type: "FULL_TIME", snippet: "SNSで有名なハンバーグ店。日本語が苦手な外国人の方や留学生も大活躍中。月給32万円以上。", contact: { name: "店舗採用担当", phone: "" } },
  { title: "トラック部品組立スタッフ", company: "UTエイム株式会社", location: "神奈川", salary: "月給 230000-254000", type: "CONTRACT", snippet: "外国人の方も活躍している職場。未経験歓迎。2交代制。食堂180円。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },
  { title: "ラーメン居酒屋スタッフ（正社員）", company: "株式会社天晴れ", location: "新潟", salary: "月給 250000-400000", type: "FULL_TIME", snippet: "外国人留学生歓迎。未経験者も大歓迎。月給25万円～40万円。", contact: { name: "天晴れ採用担当", phone: "" } },
  { title: "車体部品取付け～検査（月収28万可）", company: "UTエイム株式会社", location: "三重", salary: "月給 260000", type: "CONTRACT", snippet: "交替勤務。車体組立経験者歓迎。未経験OK。外国人歓迎。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },
  { title: "ラーメン店ランチスタッフ（町田商店）", company: "町田商店 上越店", location: "新潟", salary: "時給 1100", type: "PART_TIME", snippet: "N3レベルの方歓迎。扶養内勤務OK。ラーメン店でのランチタイムスタッフ。", contact: { name: "店舗採用担当", phone: "" } },
  { title: "高原リゾートのスイーツパティシエ", company: "赤倉観光ホテル/R&Mリゾート株式会社", location: "新潟", salary: "月給 250000-300000", type: "FULL_TIME", snippet: "留学生、外国人活躍中。新卒・第二新卒歓迎。高原リゾートでのパティシエ業務。", contact: { name: "人事部採用担当", phone: "" } },
  { title: "トラック製造スタッフ", company: "UTエイム株式会社", location: "神奈川", salary: "月給 230000-324000", type: "CONTRACT", snippet: "外国人の方も活躍している職場。面接なし入社可。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },

  // Page 2 - 外国人歓迎
  { title: "自動車エンジンの製造加工（家族寮完備）", company: "UTエイム株式会社", location: "愛知", salary: "月給 300000", type: "CONTRACT", snippet: "2交代制。家族寮完備。外国人歓迎。自動車エンジンの製造加工。", contact: { name: "UTエイム採用センター", phone: "0120-934-760" } },
  { title: "内装解体・現場サポートスタッフ", company: "株式会社ゲンジ", location: "東京", salary: "日給 13000-15000", type: "PART_TIME", snippet: "内装解体・養生・現場サポート。外国人歓迎。日払いOK。", contact: { name: "ゲンジ採用担当", phone: "" } },
  { title: "工事現場の監視・誘導警備", company: "合同会社BN3", location: "茨城", salary: "日給 10000-12500", type: "PART_TIME", snippet: "工事現場・一般道路などの監視・誘導。外国人歓迎。日払い可。", contact: { name: "BN3採用担当", phone: "" } },
  { title: "セラミック部品の検査・機械オペレーター", company: "西武興産", location: "岐阜", salary: "時給 1350-1400", type: "CONTRACT", snippet: "セラミック部品の目視検査・加工・機械オペレーター。外国人歓迎。", contact: { name: "西武興産採用担当", phone: "" } },
  { title: "交通誘導警備（個室寮完備・日払い可）", company: "大真綜合警備保障", location: "東京", salary: "日給 10920-13335", type: "PART_TIME", snippet: "手荷物一つで即入居可の個室寮完備。日払い可。外国人歓迎。", contact: { name: "大真警備採用担当", phone: "" } },
  { title: "製造スタッフ（亀山）", company: "株式会社マキシム", location: "三重", salary: "時給 1670-2087", type: "CONTRACT", snippet: "製造スタッフ。高時給。外国人歓迎。", contact: { name: "マキシム採用担当", phone: "" } },
  { title: "機械操作・製造補助（寮無料・月収36万）", company: "日総工産株式会社", location: "神奈川", salary: "月給 360383", type: "CONTRACT", snippet: "寮無料。月収36万円。機械操作・製造補助。外国人歓迎。", contact: { name: "日総工産コールセンター", phone: "0120-717-450" } },
  { title: "仮設トイレの組立（製造職）", company: "株式会社ハマネツ", location: "静岡", salary: "月給 212000-275000", type: "FULL_TIME", snippet: "仮設トイレの組立。正社員。外国人歓迎。", contact: { name: "ハマネツ人事部", phone: "" } },
  { title: "トラックフレームの製造・組み立て", company: "株式会社インフィニティ", location: "神奈川", salary: "時給 1800-2250", type: "CONTRACT", snippet: "トラックフレームの製造・組み立て。高時給。外国人歓迎。", contact: { name: "インフィニティ採用担当", phone: "" } },
  { title: "タイヤ製造 機械オペレーター", company: "UTエージェント株式会社", location: "福岡", salary: "月給 260000-300000", type: "CONTRACT", snippet: "タイヤ製造の機械オペレーター。外国人歓迎。", contact: { name: "UTエージェント採用センター", phone: "" } },
  { title: "機械の組立・配線", company: "有限会社エスブランド", location: "宮城", salary: "月給 220000", type: "FULL_TIME", snippet: "機械の組立・配線。正社員。外国人歓迎。", contact: { name: "エスブランド採用担当", phone: "" } },
  { title: "トラック製造工場での溶接作業", company: "株式会社インフィニティ", location: "神奈川", salary: "時給 1900-2250", type: "CONTRACT", snippet: "トラック製造工場での溶接作業。高時給。外国人歓迎。", contact: { name: "インフィニティ採用担当", phone: "" } },

  // Page 3 - 外国人歓迎
  { title: "日本語学校の留学生サポート", company: "SIJAさくら国際日本語学院", location: "埼玉", salary: "月給 230000-240000", type: "FULL_TIME", snippet: "日本語学校で留学生のサポート業務。正社員。外国人歓迎。", contact: { name: "採用担当", phone: "" } },
  { title: "カフェのホールスタッフ（外国人観光客対応）", company: "COLONY by EQI", location: "大阪", salary: "月給 270000-400000", type: "FULL_TIME", snippet: "外国人観光客への英語を用いた接客。心斎橋のカフェ。", contact: { name: "COLONY採用担当", phone: "" } },
  { title: "外国人技能実習生の監理・サポート", company: "協同組合TOYOWORLDING", location: "愛知", salary: "月給 250000-350000", type: "FULL_TIME", snippet: "外国人技能実習生の監理・サポートスタッフ。正社員。", contact: { name: "TOYOWORLDING採用担当", phone: "" } },
  { title: "訪日外国人観光客向けツアーガイド", company: "トップビューホリデージャパン株式会社", location: "東京", salary: "日給 20000", type: "CONTRACT", snippet: "訪日外国人観光客向けツアーガイド。日給2万円以上。外国語が活かせる。", contact: { name: "採用担当", phone: "" } },
  { title: "製造管理（外国人人材の管理・教育）", company: "株式会社武蔵野フーズ カムス第2工場", location: "埼玉", salary: "月給 200000-250700", type: "FULL_TIME", snippet: "外国人人材の管理、教育、支援業務。製造管理スタッフ。", contact: { name: "武蔵野フーズ人事部", phone: "" } },
  { title: "京都の寿司握り体験店スタッフ", company: "株式会社GARYU", location: "京都", salary: "時給 1400-1600", type: "PART_TIME", snippet: "外国人観光客向け寿司握り体験店。オープニングスタッフ。レクチャー・ホール業務。", contact: { name: "GARYU採用担当", phone: "" } },
  { title: "外国人向け通信サービス総合職", company: "株式会社Og", location: "東京", salary: "月給 304167-429167", type: "FULL_TIME", snippet: "外国人向け通信サービスの総合職。年収365万円～515万円。", contact: { name: "Og人事部", phone: "" } },
  { title: "技能実習生・特定技能生のサポート", company: "瀬戸内テック協同組合", location: "熊本", salary: "月給 270000-330000", type: "FULL_TIME", snippet: "外国人技能実習生・特定技能生のサポート業務。正社員。", contact: { name: "瀬戸内テック採用担当", phone: "" } },
  { title: "日本文化体験施設の接客・案内スタッフ", company: "GLOBA株式会社", location: "東京", salary: "月給 325000-550000", type: "FULL_TIME", snippet: "訪日外国人への接客・案内業務。日本文化体験施設。月給32.5万円～55万円。", contact: { name: "GLOBA人事部", phone: "" } },
  { title: "日本語学校の留学生サポート事務", company: "赤門会日本語学校", location: "東京", salary: "月給 250000-275000", type: "FULL_TIME", snippet: "日本語学校で留学生のサポート事務。中国語担当。正社員。", contact: { name: "赤門会採用担当", phone: "" } },
];

const LOCATION_MAP: Record<string, string> = {
  "東京": "東京", "大阪": "大阪", "福岡": "福岡", "広島": "広島",
  "京都": "京都", "神奈川": "横浜", "愛知": "愛知", "静岡": "静岡",
  "千葉": "千葉", "埼玉": "埼玉", "三重": "三重", "新潟": "新潟",
  "茨城": "茨城", "岐阜": "岐阜", "宮城": "仙台", "熊本": "熊本",
  "石川": "石川", "沖縄": "沖縄", "長崎": "福岡",
};

function detectCategory(title: string, snippet: string): string {
  const text = title + " " + snippet;
  if (/製造|工場|部品|組立|検査|検品|オペレーター|機械|溶接|セラミック|タイヤ|エンジン|トラック|メンテナンス/.test(text)) return "Үйлдвэрлэл, Угсралт";
  if (/解体|建設|警備|誘導/.test(text)) return "Барилга";
  if (/物流|配達|倉庫/.test(text)) return "Логистик, Агуулах";
  if (/食品|フーズ/.test(text)) return "Хүнсний үйлдвэрлэл";
  if (/レストラン|飲食|キッチン|ホール|居酒屋|ラーメン|カフェ|ホテル|リゾート|パティシエ|寿司|ハンバーグ/.test(text)) return "Зочид буудал, Хоол";
  if (/通訳|翻訳|販売|事務|サポート|ガイド|案内|学校|通信/.test(text)) return "Орчуулга, Оффис";
  if (/清掃/.test(text)) return "Цэвэрлэгээ, Үйлчилгээ";
  return "Үйлдвэрлэл, Угсралт";
}

function parseSalary(text: string): { min: number; max: number } {
  const cleaned = text.replace(/,/g, "");
  if (text.includes("月給")) {
    const match = cleaned.match(/(\d+)\D*?(\d+)/);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };
    const single = cleaned.match(/(\d{5,})/);
    if (single) return { min: parseInt(single[1]), max: parseInt(single[1]) };
  }
  if (text.includes("時給")) {
    const match = cleaned.match(/(\d{3,})\D*?(\d{3,})/);
    if (match) return { min: parseInt(match[1]) * 176, max: parseInt(match[2]) * 176 };
    const single = cleaned.match(/(\d{3,})/);
    if (single) return { min: parseInt(single[1]) * 176, max: parseInt(single[1]) * 176 };
  }
  if (text.includes("日給")) {
    const match = cleaned.match(/(\d{4,})\D*?(\d{4,})/);
    if (match) return { min: parseInt(match[1]) * 22, max: parseInt(match[2]) * 22 };
    const single = cleaned.match(/(\d{4,})/);
    if (single) return { min: parseInt(single[1]) * 22, max: parseInt(single[1]) * 22 };
  }
  return { min: 200000, max: 250000 };
}

async function main() {
  console.log("🇯🇵 Indeed Japan (外国人歓迎) мэдээлэл оруулж байна...\n");

  const categoryMap: Record<string, string> = {};
  const catNames = [
    "Үйлдвэрлэл, Угсралт", "Барилга", "Логистик, Агуулах",
    "Хүнсний үйлдвэрлэл", "Зочид буудал, Хоол", "Орчуулга, Оффис",
    "Цэвэрлэгээ, Үйлчилгээ",
  ];
  for (const name of catNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) cat = await prisma.category.create({ data: { name, icon: "Wrench" } });
    categoryMap[name] = cat.id;
  }

  let inserted = 0;
  for (const job of JOBS_DATA) {
    try {
      const locationKey = LOCATION_MAP[job.location] || "東京";
      const salary = parseSalary(job.salary);
      const catName = detectCategory(job.title, job.snippet);
      const categoryId = categoryMap[catName] || categoryMap["Үйлдвэрлэл, Угсралт"];

      let company = await prisma.company.findFirst({ where: { name: job.company, country: "JP" } });
      if (!company) {
        company = await prisma.company.create({
          data: {
            name: job.company,
            country: "JP",
            location: locationKey,
            industry: "Indeed Japan",
            description: `Indeed Japan (外国人歓迎) ажлын зар`,
          },
        });
      }

      await prisma.job.create({
        data: {
          title: job.title,
          description: `${job.snippet}\n\n📌 Indeed Japan (外国人歓迎) дээрх ажлын зар`,
          requirements: ["外国人歓迎 (Гадаадын иргэдийг урьж байна)", "学歴不問 (Боловсролын шаардлагагүй)"],
          responsibilities: ["Ажлын байранд очиж мэдэгдэнэ"],
          benefits: ["社会保険完備 (4 даатгал)", "交通費支給 (Тээврийн зардал)"],
          salaryMin: salary.min,
          salaryMax: salary.max,
          currency: "JPY",
          country: "JP",
          location: locationKey,
          type: job.type,
          mode: "ONSITE",
          experience: "ENTRY",
          contactName: job.contact.name || null,
          contactPhone: job.contact.phone || null,
          companyId: company.id,
          categoryId,
        },
      });
      inserted++;
      console.log(`   ✓ ${job.title}`);
    } catch (err) {
      console.error(`   ✗ ${job.title}: ${(err as Error).message?.substring(0, 60)}`);
    }
  }

  console.log(`\n✅ Дууслаа! ${inserted} ажлын зар нэмэгдлээ (холбоо барихтай).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
