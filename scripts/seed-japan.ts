import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🇯🇵 Япон дахь ажлын зар нэмж байна...\n");

  const companies = await Promise.all([
    prisma.company.create({ data: { name: "Toyota Motor", country: "JP", industry: "Автомашин үйлдвэрлэл", location: "愛知", description: "Дэлхийн хамгийн том автомашины компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "Sony Group", country: "JP", industry: "Электроник", location: "東京", description: "Электроник, тоглоом, хөгжим", size: "1000+" } }),
    prisma.company.create({ data: { name: "ヤマト運輸 (Yamato)", country: "JP", industry: "Логистик", location: "東京", description: "Японы хамгийн том хүргэлтийн компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "セブンイレブン (7-Eleven)", country: "JP", industry: "Жижиглэн худалдаа", location: "東京", description: "Японы хамгийн том convenience store сүлжээ", size: "1000+" } }),
    prisma.company.create({ data: { name: "すき家 (Sukiya)", country: "JP", industry: "Хоол үйлдвэрлэл", location: "東京", description: "Японы тэргүүлэгч хоолны сүлжээ", size: "1000+" } }),
    prisma.company.create({ data: { name: "日産自動車 (Nissan)", country: "JP", industry: "Автомашин", location: "横浜", description: "Автомашин үйлдвэрлэл, угсралт", size: "1000+" } }),
    prisma.company.create({ data: { name: "大和ハウス (Daiwa House)", country: "JP", industry: "Барилга", location: "大阪", description: "Японы том барилгын компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "ファナック (FANUC)", country: "JP", industry: "Үйлдвэрлэл", location: "静岡", description: "Робот, CNC машин үйлдвэрлэл", size: "500-1000" } }),
    prisma.company.create({ data: { name: "ユニクロ (UNIQLO)", country: "JP", industry: "Хувцас", location: "東京", description: "Дэлхийн алдартай хувцасны брэнд", size: "1000+" } }),
    prisma.company.create({ data: { name: "アパホテル (APA Hotel)", country: "JP", industry: "Зочид буудал", location: "東京", description: "Японы хамгийн том зочид буудлын сүлжээ", size: "1000+" } }),
    prisma.company.create({ data: { name: "北海道水産 (Hokkaido Suisan)", country: "JP", industry: "Загас боловсруулалт", location: "北海道", description: "Далайн бүтээгдэхүүн боловсруулалт", size: "200-500" } }),
    prisma.company.create({ data: { name: "茨城農園 (Ibaraki Farm)", country: "JP", industry: "Хөдөө аж ахуй", location: "茨城", description: "Ногоо, жимсний аж ахуй", size: "50-200" } }),
  ]);

  // Reuse or create categories
  const catNames = [
    "Үйлдвэрлэл, Угсралт", "Барилга", "Логистик, Агуулах",
    "Хүнсний үйлдвэрлэл", "Хөдөө аж ахуй", "Загас боловсруулалт",
    "Нэхмэл, Хувцас", "Цэвэрлэгээ, Үйлчилгээ", "Зочид буудал, Хоол",
    "Тээвэр, Жолоодлого", "IT, Технологи", "Орчуулга, Оффис",
  ];
  const categories: Record<string, string> = {};
  for (const name of catNames) {
    let cat = await prisma.category.findFirst({ where: { name } });
    if (!cat) cat = await prisma.category.create({ data: { name, icon: "Wrench" } });
    categories[name] = cat.id;
  }

  const jobs = [
    { title: "Автомашины үйлдвэрийн ажилтан (組立)", company: companies[0], category: categories["Үйлдвэрлэл, Угсралт"], description: "Toyota-ийн Айчи дахь үйлдвэрт автомашин угсрах. Японы техникийн дадлага (技能実習) визтэй ажиллах боломжтой.", requirements: ["Биеийн эрүүл мэнд сайн", "N4 түвшний япон хэл давуу"], responsibilities: ["Автомашин угсрах", "Чанарын шалгалт", "Эд анги бэлтгэх"], benefits: ["Байр өгнө (寮完備)", "4 даатгал", "Тээврийн зардал", "Жилийн 2 удаа урамшуулал"], salaryMin: 250000, salaryMax: 300000, location: "愛知", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Электроникийн үйлдвэрийн ажилтан", company: companies[1], category: categories["Үйлдвэрлэл, Угсралт"], description: "Sony-ийн үйлдвэрт электрон эд анги угсрах, шалгах ажил.", requirements: ["Нарийн ажил хийх чадвар", "Цэвэр өрөөнд ажиллах боломж"], responsibilities: ["Электрон эд анги угсрах", "Визуал шалгалт", "Савлах"], benefits: ["Байр өгнө", "Шөнийн нэмэгдэл 25%", "Тээврийн зардал"], salaryMin: 230000, salaryMax: 280000, location: "東京", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Хүргэлтийн ажилтан (配達員)", company: companies[2], category: categories["Логистик, Агуулах"], description: "Yamato Transport-ийн хүргэлтийн ажилтан. Жолооны үнэмлэхтэй хүн давуу.", requirements: ["Японы жолооны үнэмлэх давуу", "N3 түвшний япон хэл"], responsibilities: ["Бараа хүргэх", "Бараа ангилах", "Үйлчлүүлэгчтэй харилцах"], benefits: ["Тээврийн зардал", "Илүү цагийн нэмэгдэл", "4 даатгал"], salaryMin: 250000, salaryMax: 320000, location: "東京", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Дэлгүүрийн ажилтан (コンビニ)", company: companies[3], category: categories["Зочид буудал, Хоол"], description: "7-Eleven дэлгүүрт кассчин, бараа тавих ажил. Оюутны виз (28 цаг/7 хоног) боломжтой.", requirements: ["N3 түвшний япон хэл", "Хариуцлагатай"], responsibilities: ["Касс ажиллуулах", "Бараа тавих", "Дэлгүүр цэвэрлэх"], benefits: ["Уян цагийн хуваарь", "Хоолны хямдрал", "Тээврийн зардал"], salaryMin: 200000, salaryMax: 230000, location: "東京", type: "PART_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Хоолны газрын ажилтан (飲食店)", company: companies[4], category: categories["Зочид буудал, Хоол"], description: "Sukiya ресторанд хоол бэлтгэх, үйлчлэх. Шөнийн ээлжинд нэмэгдэлтэй.", requirements: ["Суурь япон хэл", "Цэвэрч нямбай"], responsibilities: ["Хоол бэлтгэх", "Үйлчлүүлэгчдэд үйлчлэх", "Цэвэрлэгээ"], benefits: ["Ажлын үед хоол өгнө", "Шөнийн 25% нэмэгдэл", "Уян цагийн хуваарь"], salaryMin: 190000, salaryMax: 250000, location: "大阪", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Автомашины эд анги үйлдвэрлэл", company: companies[5], category: categories["Үйлдвэрлэл, Угсралт"], description: "Nissan-ий Ёкохама дахь үйлдвэрт автомашины эд анги пресслэх, будах.", requirements: ["Биеийн тамир сайн", "Ээлжээр ажиллах боломж"], responsibilities: ["Пресс машин ажиллуулах", "Будгийн ажил", "Чанарын шалгалт"], benefits: ["Байр өгнө", "Илүү цагийн нэмэгдэл", "Жилийн урамшуулал"], salaryMin: 260000, salaryMax: 310000, location: "横浜", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Барилгын ажилтан (建設作業員)", company: companies[6], category: categories["Барилга"], description: "Daiwa House-ийн барилгын талбайд ажиллах. Техникийн дадлага визтэй.", requirements: ["Барилгын ажлын туршлага давуу", "Биеийн эрүүл мэнд"], responsibilities: ["Барилгын материал зөөх", "Дотор засал", "Аюулгүй ажиллагаа"], benefits: ["Өндөр цалин", "Байр өгнө", "Тээврийн зардал"], salaryMin: 280000, salaryMax: 350000, location: "大阪", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "CNC машин оператор", company: companies[7], category: categories["Үйлдвэрлэл, Угсралт"], description: "FANUC-ийн үйлдвэрт CNC машин ажиллуулах. Техникийн мэдлэгтэй хүн давуу.", requirements: ["CNC машины туршлага давуу", "Техникийн мэргэжил"], responsibilities: ["CNC машин ажиллуулах", "Хэмжилт хийх", "Засвар үйлчилгээ"], benefits: ["Мэргэжлийн нэмэгдэл", "Байр өгнө", "Урамшуулал"], salaryMin: 280000, salaryMax: 340000, location: "静岡", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Хувцасны дэлгүүрийн ажилтан", company: companies[8], category: categories["Нэхмэл, Хувцас"], description: "UNIQLO дэлгүүрт борлуулалт, бараа тавих ажил.", requirements: ["N3 түвшний япон хэл", "Борлуулалтын туршлага давуу"], responsibilities: ["Үйлчлүүлэгчдэд зөвлөгөө", "Бараа тавих", "Касс"], benefits: ["Ажилтны хямдрал 30%", "Тээврийн зардал", "Уян цаг"], salaryMin: 200000, salaryMax: 240000, location: "東京", type: "PART_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Зочид буудлын өрөөний үйлчлэгч", company: companies[9], category: categories["Цэвэрлэгээ, Үйлчилгээ"], description: "APA Hotel-ийн өрөө цэвэрлэх ажил. Япон хэл шаардлагагүй.", requirements: ["Цэвэрч нямбай", "Биеийн эрүүл мэнд"], responsibilities: ["Өрөө цэвэрлэх", "Бүтээгдэхүүн нөхөх", "Угаалгын газар цэвэрлэх"], benefits: ["Зочид буудлын хямдрал", "Тээврийн зардал", "Байр өгнө"], salaryMin: 200000, salaryMax: 240000, location: "東京", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Загас боловсруулах ажилтан (水産加工)", company: companies[10], category: categories["Загас боловсруулалт"], description: "Хоккайдо дахь загас боловсруулах үйлдвэрт ажиллах.", requirements: ["Хүйтэнд тэсвэртэй", "Эрүүл мэндийн шинжилгээ"], responsibilities: ["Загас цэвэрлэх", "Филэ хийх", "Савлах, хөлдөөх"], benefits: ["Байр, хоол өгнө", "Тээврийн зардал", "Загасны бүтээгдэхүүн"], salaryMin: 220000, salaryMax: 270000, location: "北海道", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Хөдөө аж ахуйн ажилтан (農業)", company: companies[11], category: categories["Хөдөө аж ахуй"], description: "Ибараки дахь фермд ногоо тарих, хураах ажил. Техникийн дадлага виз.", requirements: ["Хөдөө аж ахуйн туршлага давуу", "Биеийн тамир сайн"], responsibilities: ["Ногоо тарих", "Хураалт хийх", "Хүлэмж арчлах"], benefits: ["Байр, хоол өгнө", "Улирлын урамшуулал", "4 даатгал"], salaryMin: 210000, salaryMax: 260000, location: "茨城", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Агуулахын ажилтан (倉庫作業)", company: companies[2], category: categories["Логистик, Агуулах"], description: "Yamato-ийн агуулахад бараа ангилах, савлах ажил.", requirements: ["Биеийн эрүүл мэнд", "Ээлжээр ажиллах боломж"], responsibilities: ["Бараа ангилах", "Сканнердах", "Ачих, буулгах"], benefits: ["Шөнийн нэмэгдэл 25%", "Тээврийн зардал"], salaryMin: 210000, salaryMax: 260000, location: "千葉", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Тогооч (調理補助)", company: companies[4], category: categories["Зочид буудал, Хоол"], description: "Sukiya ресторанд тогоочийн туслах. Хоол хийх дуртай хүн тавтай морил.", requirements: ["Хоол хийх суурь чадвар", "Эрүүл мэндийн шинжилгээ"], responsibilities: ["Хоол бэлтгэх", "Орц бэлтгэх", "Гал тогоо цэвэрлэх"], benefits: ["Ажлын үед хоол", "Тээврийн зардал", "Урамшуулал"], salaryMin: 220000, salaryMax: 260000, location: "名古屋", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Орчуулагч (Монгол-Япон)", company: companies[0], category: categories["Орчуулга, Оффис"], description: "Toyota-ийн үйлдвэрт Монгол ажилтнуудад орчуулга, дасан зохицох дэмжлэг үзүүлэх.", requirements: ["JLPT N2 түвшин", "Монгол, Япон хэл чөлөөтэй"], responsibilities: ["Үйлдвэрийн заавар орчуулах", "Хурал дээр орчуулах", "Шинэ ажилтнуудад туслах"], benefits: ["Оффисын ажил", "Өндөр цалин", "Ахих боломж"], salaryMin: 280000, salaryMax: 350000, location: "愛知", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Цэвэрлэгээний ажилтан (清掃)", company: companies[9], category: categories["Цэвэрлэгээ, Үйлчилгээ"], description: "APA Hotel-ийн нийтийн талбай цэвэрлэх ажил. Шөнийн ээлж.", requirements: ["Цэвэрч нямбай", "Шөнийн ээлжээр ажиллах боломж"], responsibilities: ["Нийтийн талбай цэвэрлэх", "Угаалгын газар", "Хог зайлуулах"], benefits: ["Шөнийн 25% нэмэгдэл", "Байр өгнө"], salaryMin: 200000, salaryMax: 230000, location: "大阪", type: "PART_TIME", mode: "ONSITE", experience: "ENTRY" },
  ];

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: "JPY",
        country: "JP",
        location: job.location,
        type: job.type,
        mode: job.mode,
        experience: job.experience,
        companyId: job.company.id,
        categoryId: job.category,
      },
    });
  }

  console.log(`✅ ${jobs.length} Япон дахь ажлын зар нэмэгдлээ!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
