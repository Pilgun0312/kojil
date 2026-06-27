import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Data scraped from jp.indeed.com search: 外国人
const JOBS_DATA = [
  // Page 1
  { title: "半導体製造装置のメンテナンス", company: "株式会社BREXA Technology", location: "三重", salary: "月給 200000-270000", type: "CONTRACT", snippet: "半導体製造装置のメンテナンス。未経験者歓迎で夜勤手当で高収入。外国人歓迎。" },
  { title: "駅ナカ蕎麦店のキッチン・接客スタッフ", company: "めとろ庵 新木場店", location: "東京", salary: "時給 1250-1680", type: "PART_TIME", snippet: "外国人活躍中。JLPT N2またはN3対象。駅中の蕎麦店でキッチンと接客業務。" },
  { title: "部品の動作チェック・検査スタッフ", company: "株式会社ワールドインテック", location: "三重", salary: "月給 224000-394000", type: "CONTRACT", snippet: "スマホ面接1回だけ。年休125日。寮費半額。送迎あり。部品の動作チェック。" },
  { title: "半導体工場での検査・検品製造スタッフ", company: "日研トータルソーシング株式会社", location: "広島", salary: "月給 285000", type: "CONTRACT", snippet: "半導体工場での検査・検品業務。クリーンルーム内での軽作業。外国人歓迎。" },
  { title: "CANON工場の検品スタッフ", company: "株式会社ワールドインテック", location: "長崎", salary: "月給 240000-301438", type: "CONTRACT", snippet: "CANONで働く。直接雇用のチャンス。検品スタッフ。正社員登用あり。" },
  { title: "製造スタッフ（寮費無料・月32万）", company: "株式会社ワールドインテック", location: "長崎", salary: "月給 240000-320794", type: "CONTRACT", snippet: "20万の入社祝い。重たい物ナシ。寮費無料。月収32万円可能。" },
  { title: "電子部品系工場での検査・製造スタッフ", company: "日研トータルソーシング株式会社", location: "山口", salary: "月給 337000", type: "CONTRACT", snippet: "電子部品系工場での検査・検品製造。高月収。外国人活躍中。" },
  { title: "バーコード読み取り・軽作業（寮費0円）", company: "株式会社ワールドインテック", location: "長崎", salary: "月給 192000-225681", type: "CONTRACT", snippet: "ピピッとバーコード読み取り。3日行ったら3連休。寮費0円。軽作業。" },
  { title: "キッチンスタッフ（ほっともっと）", company: "ほっともっと 小諸東店", location: "長野", salary: "時給 1150-1438", type: "PART_TIME", snippet: "外国人、留学生も活躍中。ベトナム、ミャンマー、ネパールなど多国籍スタッフ在籍。" },
  { title: "機械操作・製造補助（半導体工場）", company: "フジアルテ株式会社", location: "滋賀", salary: "月給 320000", type: "CONTRACT", snippet: "半導体工場での機械操作・製造補助。交替制。高月収。" },
  { title: "製造オペレーター・軽作業（電子部品）", company: "株式会社ワールドインテック", location: "兵庫", salary: "月給 277500", type: "CONTRACT", snippet: "電子部品系工場での製造オペレーター。日勤のみ。" },
  { title: "製造スタッフ（大増員・空調完備）", company: "株式会社ワールドインテック", location: "大分", salary: "月給 240000-296375", type: "CONTRACT", snippet: "10名の大増員。キレイな空調完備の工場。履歴書ナシ。" },
  { title: "材料セット作業（家賃0円個室寮付き）", company: "株式会社ワールドインテック", location: "滋賀", salary: "月給 200400-321444", type: "CONTRACT", snippet: "装置への材料セット。家賃0円個室寮付き。スマホ面接1回だけ。" },
  { title: "半導体製造マシンオペレーター", company: "UTエイム株式会社", location: "京都", salary: "月給 211000-225000", type: "CONTRACT", snippet: "2交代制。半導体製造部品のマシンオペレーター。髪型・髪色自由。" },
  { title: "機械操作・製造補助（寮無料・月30万）", company: "日総工産株式会社", location: "石川", salary: "月給 308931", type: "CONTRACT", snippet: "寮無料。月収30.5万円。機械操作・製造補助。" },

  // Page 2
  { title: "ごまそば店スタッフ（日中）", company: "北前そば高田屋 品川港南口店", location: "東京", salary: "時給 1300", type: "PART_TIME", snippet: "駅近のそば店でのキッチン・接客業務。外国人歓迎。日本語日常会話レベル。" },
  { title: "通訳販売スタッフ（銀座）", company: "株式会社スタッフブリッジ", location: "東京", salary: "時給 1550-1700", type: "CONTRACT", snippet: "HELEN KAMINSKI銀座店での通訳販売。外国語が活かせるお仕事。" },
  { title: "通訳販売スタッフ（渋谷）", company: "株式会社スタッフブリッジ", location: "東京", salary: "時給 1500-1650", type: "CONTRACT", snippet: "シューズブランド渋谷店での通訳販売。外国人観光客対応。" },
  { title: "ホテル朝食フロアスタッフ", company: "ホテル富士トリイゲート", location: "山梨", salary: "時給 1200", type: "PART_TIME", snippet: "ホテルの朝食フロアオープニングスタッフ。外国人歓迎。" },
  { title: "焼肉きんぐ 夕方夜ホールスタッフ", company: "焼肉きんぐ 東近江店", location: "滋賀", salary: "時給 1100", type: "PART_TIME", snippet: "焼肉レストランでのホール業務。夕方から夜のシフト。外国人歓迎。" },
  { title: "アジアンリゾートレストランのホール", company: "Plataran Resort & Restaurant", location: "東京", salary: "時給 1300", type: "PART_TIME", snippet: "新宿のアジアンリゾートレストランでのホールスタッフ。外国人活躍中。" },
  { title: "ホテル朝食スタッフ（浜松町）", company: "スーパーホテル東京・浜松町", location: "東京", salary: "時給 1250-1400", type: "PART_TIME", snippet: "ホテルの朝食ビュッフェホールスタッフ。配膳・接客業務。" },
  { title: "通訳販売スタッフ（心斎橋PARCO）", company: "株式会社スタッフブリッジ", location: "大阪", salary: "時給 1550-1650", type: "CONTRACT", snippet: "Ami Paris心斎橋PARCOでの通訳販売。外国語スキル活用。" },

  // Page 3
  { title: "すき焼き店 ホール・キッチンスタッフ", company: "牛丸 新町店", location: "大阪", salary: "時給 1200-1300", type: "PART_TIME", snippet: "大阪のすき焼き店でのホール・キッチン業務。外国人歓迎。" },
  { title: "中華ラーメン店スタッフ", company: "揚州商人 田無店", location: "東京", salary: "時給 1230-1538", type: "PART_TIME", snippet: "中華ラーメン店でのホール・キッチン業務。外国人留学生歓迎。" },
  { title: "ホテルレストラン ホールサービス", company: "ホテルオリエンタルエクスプレス", location: "福岡", salary: "時給 1100", type: "PART_TIME", snippet: "博多のホテルレストランでのホールサービス。外国人歓迎。" },
  { title: "朝食ビュッフェ ホールスタッフ", company: "THE ORIENT レストラン部門", location: "兵庫", salary: "時給 1200", type: "PART_TIME", snippet: "ホテルの朝食ビュッフェでのホール業務。" },
  { title: "ラーメン専門店 ホールスタッフ", company: "ラーメン専門店 小川", location: "東京", salary: "時給 1250", type: "PART_TIME", snippet: "ラーメン専門店でのホール業務。外国人歓迎。" },
  { title: "もつ鍋店 キッチンスタッフ", company: "楽天地株式会社", location: "福岡", salary: "時給 1300", type: "PART_TIME", snippet: "福岡のもつ鍋店でのキッチン業務。外国人歓迎。" },
  { title: "寿司製造補助スタッフ", company: "風月フーズ株式会社", location: "沖縄", salary: "時給 1050", type: "PART_TIME", snippet: "沖縄での寿司製造補助。外国人歓迎。" },
  { title: "金型組立作業員", company: "株式会社TM-Tex", location: "京都", salary: "時給 1250", type: "CONTRACT", snippet: "京都での金型組立作業。技能実習生・外国人歓迎。" },
  { title: "TGI FRIDAYS ランチスタッフ", company: "TGI FRIDAYS 新宿歌舞伎町店", location: "東京", salary: "時給 1250", type: "PART_TIME", snippet: "アメリカンレストランでのランチタイムスタッフ。外国人歓迎。" },
  { title: "ラーメン店 キッチン・ホールスタッフ", company: "丸岡 犬山店", location: "愛知", salary: "時給 1150-1500", type: "PART_TIME", snippet: "ラーメン店でのキッチン・ホール業務。外国人歓迎。" },
  { title: "空港レストラン 調理補助", company: "風月フーズ株式会社", location: "沖縄", salary: "時給 1100", type: "PART_TIME", snippet: "沖縄空港レストランでの調理補助。外国人歓迎。" },
  { title: "海鮮BBQレストランスタッフ", company: "CRAFT CIRCUS 海魚市場", location: "兵庫", salary: "時給 1200-1500", type: "PART_TIME", snippet: "海鮮BBQレストランでのホール業務。外国人活躍中。" },
  { title: "牛丼チェーン店 キッチンスタッフ", company: "株式会社トラストファミリー", location: "福岡", salary: "時給 1130", type: "CONTRACT", snippet: "牛丼チェーン店でのキッチン業務。外国人歓迎。" },
  { title: "和食店 ホール兼キッチンスタッフ（銀座）", company: "銀座 しまだ", location: "東京", salary: "時給 1400", type: "PART_TIME", snippet: "銀座の和食店でのホール・キッチン業務。外国人歓迎。" },
  { title: "油そば専門店スタッフ（高田馬場）", company: "東京麺珍亭本舗 高田馬場店", location: "東京", salary: "時給 1300", type: "PART_TIME", snippet: "元祖油そば屋のスタッフ。外国人留学生歓迎。" },
];

// Map Japanese location to our prefecture keys
const LOCATION_MAP: Record<string, string> = {
  "東京": "東京", "大阪": "大阪", "福岡": "福岡", "広島": "広島",
  "京都": "京都", "兵庫": "神戸", "石川": "石川", "三重": "三重",
  "長崎": "福岡", "大分": "福岡", "山口": "広島", "長野": "長野",
  "滋賀": "愛知", "山梨": "東京", "沖縄": "沖縄", "愛知": "愛知",
};

function detectCategory(title: string, snippet: string): string {
  const text = title + " " + snippet;
  if (/製造|工場|半導体|組立|検査|検品|部品|オペレーター|機械|メンテナンス|金型/.test(text)) return "Үйлдвэрлэл, Угсралт";
  if (/物流|配達|配送|倉庫|バーコード/.test(text)) return "Логистик, Агуулах";
  if (/通訳|翻訳|販売/.test(text)) return "Орчуулга, Оффис";
  if (/レストラン|飲食|キッチン|ホール|調理|ホテル|蕎麦|焼肉|寿司|ラーメン|油そば|もつ鍋|すき焼き|コンビニ|カフェ|朝食|FRIDAYS/.test(text)) return "Зочид буудал, Хоол";
  if (/清掃/.test(text)) return "Цэвэрлэгээ, Үйлчилгээ";
  return "Үйлдвэрлэл, Угсралт";
}

function parseSalary(text: string): { min: number; max: number } {
  const cleaned = text.replace(/,/g, "");
  // Monthly format: "月給 200000-270000"
  if (text.includes("月給")) {
    const match = cleaned.match(/(\d+)\D*?(\d+)/);
    if (match) return { min: parseInt(match[1]), max: parseInt(match[2]) };
    const single = cleaned.match(/(\d{5,})/);
    if (single) return { min: parseInt(single[1]), max: parseInt(single[1]) };
  }
  // Hourly: "時給 1250-1680"
  if (text.includes("時給")) {
    const match = cleaned.match(/(\d{3,})\D*?(\d{3,})/);
    if (match) return { min: parseInt(match[1]) * 176, max: parseInt(match[2]) * 176 }; // 8h * 22d
    const single = cleaned.match(/(\d{3,})/);
    if (single) return { min: parseInt(single[1]) * 176, max: parseInt(single[1]) * 176 };
  }
  return { min: 200000, max: 250000 };
}

async function main() {
  console.log("🇯🇵 Indeed Japan-с авсан мэдээлэл оруулж байна...\n");

  // Get or create categories
  const categoryMap: Record<string, string> = {};
  const catNames = [
    "Үйлдвэрлэл, Угсралт", "Логистик, Агуулах", "Зочид буудал, Хоол",
    "Орчуулга, Оффис", "Цэвэрлэгээ, Үйлчилгээ",
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

      // Find or create company
      let company = await prisma.company.findFirst({ where: { name: job.company, country: "JP" } });
      if (!company) {
        company = await prisma.company.create({
          data: {
            name: job.company,
            country: "JP",
            location: locationKey,
            industry: "Indeed Japan",
            description: `Indeed Japan-с авсан ажлын зар`,
          },
        });
      }

      await prisma.job.create({
        data: {
          title: job.title,
          description: `${job.snippet}\n\n📌 Indeed Japan дээрх ажлын зар`,
          requirements: ["外国人可 (Гадаадын иргэд боломжтой)", "学歴不問 (Боловсролын шаардлагагүй)"],
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

  console.log(`\n✅ Дууслаа! ${inserted} ажлын зар нэмэгдлээ.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
