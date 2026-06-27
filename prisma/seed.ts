import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.category.deleteMany();
  await prisma.company.deleteMany();

  const companies = await Promise.all([
    prisma.company.create({ data: { name: "Samsung Electronics", industry: "Электроник", location: "경기도", description: "Дэлхийн тэргүүлэгч электроникийн компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "현대자동차 (Hyundai)", industry: "Автомашин үйлдвэрлэл", location: "서울", description: "Солонгосын хамгийн том автомашины компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "CJ 대한통운", industry: "Логистик", location: "서울", description: "Солонгосын тэргүүлэгч логистик компани", size: "1000+" } }),
    prisma.company.create({ data: { name: "SK하이닉스", industry: "Технологи", location: "경기도", description: "Хагас дамжуулагч чип үйлдвэрлэл", size: "1000+" } }),
    prisma.company.create({ data: { name: "포스코 (POSCO)", industry: "Үйлдвэрлэл", location: "경상남도", description: "Дэлхийн тэргүүлэгч ган үйлдвэрлэгч", size: "1000+" } }),
    prisma.company.create({ data: { name: "한국식품", industry: "Хүнсний үйлдвэрлэл", location: "충청남도", description: "Хүнсний бүтээгдэхүүн үйлдвэрлэл, боловсруулалт", size: "200-500" } }),
    prisma.company.create({ data: { name: "서울건설", industry: "Барилга", location: "서울", description: "Барилга угсралт, дэд бүтцийн компани", size: "500-1000" } }),
    prisma.company.create({ data: { name: "인천물류센터", industry: "Агуулах, Логистик", location: "인천", description: "Агуулахын менежмент, бараа ангилалт", size: "200-500" } }),
    prisma.company.create({ data: { name: "부산수산", industry: "Загас, Далайн бүтээгдэхүүн", location: "부산", description: "Загас, далайн бүтээгдэхүүн боловсруулалт", size: "200-500" } }),
    prisma.company.create({ data: { name: "대구텍스타일", industry: "Нэхмэл", location: "대구", description: "Хувцас, нэхмэлийн үйлдвэрлэл", size: "200-500" } }),
    prisma.company.create({ data: { name: "제주관광", industry: "Аялал жуулчлал", location: "제주도", description: "Аялал жуулчлал, зочид буудлын үйлчилгээ", size: "50-200" } }),
    prisma.company.create({ data: { name: "광주전자", industry: "Электроник", location: "광주", description: "Электрон эд анги үйлдвэрлэл", size: "200-500" } }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Үйлдвэрлэл, Угсралт", icon: "Wrench" } }),
    prisma.category.create({ data: { name: "Барилга", icon: "Building" } }),
    prisma.category.create({ data: { name: "Логистик, Агуулах", icon: "Truck" } }),
    prisma.category.create({ data: { name: "Хүнсний үйлдвэрлэл", icon: "Headphones" } }),
    prisma.category.create({ data: { name: "Хөдөө аж ахуй", icon: "GraduationCap" } }),
    prisma.category.create({ data: { name: "Загас боловсруулалт", icon: "Heart" } }),
    prisma.category.create({ data: { name: "Нэхмэл, Хувцас", icon: "Palette" } }),
    prisma.category.create({ data: { name: "Цэвэрлэгээ, Үйлчилгээ", icon: "Users" } }),
    prisma.category.create({ data: { name: "Зочид буудал, Хоол", icon: "Monitor" } }),
    prisma.category.create({ data: { name: "Тээвэр, Жолоодлого", icon: "Truck" } }),
    prisma.category.create({ data: { name: "IT, Технологи", icon: "Monitor" } }),
    prisma.category.create({ data: { name: "Орчуулга, Оффис", icon: "Calculator" } }),
  ]);

  const jobs = [
    { title: "Үйлдвэрийн ажилтан (조립)", company: companies[0], category: categories[0], description: "Samsung-ийн Кёнги дахь үйлдвэрт электрон эд анги угсрах ажил. Солонгос хэл шаардлагагүй, сургалттай.", requirements: ["Биеийн эрүүл мэнд сайн", "Ээлжээр ажиллах боломжтой"], responsibilities: ["Эд анги угсрах", "Чанарын шалгалт хийх", "Угсралтын шугам дээр ажиллах"], benefits: ["Байр, хоол өгнө", "Илүү цагийн нэмэгдэл", "4 даатгал"], salaryMin: 2200000, salaryMax: 2800000, location: "경기도", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Автомашины үйлдвэрийн ажилтан", company: companies[1], category: categories[0], description: "Hyundai-ийн автомашины үйлдвэрт будаг, гагнуур, угсралтын ажил.", requirements: ["Хүнд даацын ажил хийх чадвартай", "F4 виз эзэмшигч"], responsibilities: ["Автомашины бүрхүүл будах", "Гагнуурын ажил", "Угсралтын шугамд ажиллах"], benefits: ["Өндөр цалин", "Байр өгнө", "Тээврийн зардал"], salaryMin: 2500000, salaryMax: 3500000, location: "서울", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Агуулахын ажилтан (택배 분류)", company: companies[2], category: categories[2], description: "CJ логистикийн агуулахад бараа ангилах, савлах ажил. Шөнийн ээлж.", requirements: ["Биеийн эрүүл мэнд", "Шөнийн ээлжээр ажиллах боломж"], responsibilities: ["Бараа ангилах", "Савлах, ачих", "Сканнердах"], benefits: ["Шөнийн нэмэгдэл 50%", "Тээвэр өгнө"], salaryMin: 2000000, salaryMax: 2600000, location: "서울", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Хагас дамжуулагчийн инженер", company: companies[3], category: categories[0], description: "SK하이닉스-ийн цэвэр өрөөнд хагас дамжуулагч чип үйлдвэрлэлд оролцох.", requirements: ["Техникийн мэргэжил давуу тал", "Цэвэр өрөөнд ажиллах боломж"], responsibilities: ["Чип үйлдвэрлэлийн процесс хянах", "Тоног төхөөрөмжийн засвар", "Чанарын хяналт"], benefits: ["Өндөр цалин", "Байр, хоол", "Шөнийн нэмэгдэл"], salaryMin: 2800000, salaryMax: 3800000, location: "경기도", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Ган үйлдвэрийн ажилтан", company: companies[4], category: categories[0], description: "POSCO-ийн ган үйлдвэрт ажиллах. Халуун цехийн ажил.", requirements: ["Биеийн тамир сайн", "Халуунд тэсвэртэй"], responsibilities: ["Ган хайлуулах процесст оролцох", "Тоног төхөөрөмж ажиллуулах", "Аюулгүй ажиллагаа хангах"], benefits: ["Өндөр цалин", "Байр, хоол", "Аюулын нэмэгдэл"], salaryMin: 2800000, salaryMax: 3600000, location: "경상남도", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Хүнсний үйлдвэрийн ажилтан", company: companies[5], category: categories[3], description: "Хүнсний бүтээгдэхүүн үйлдвэрлэх, савлах, чанарын хяналт хийх.", requirements: ["Эрүүл мэндийн шинжилгээ өгсөн", "Цэвэр ажиллах чадвартай"], responsibilities: ["Хүнсний бүтээгдэхүүн савлах", "Чанарын шалгалт", "Цэвэрлэгээ хийх"], benefits: ["Хоол өгнө", "Байр өгнө", "4 даатгал"], salaryMin: 2000000, salaryMax: 2500000, location: "충청남도", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Барилгын ажилтан (건설 노동자)", company: companies[6], category: categories[1], description: "Сөүл дэх барилгын талбайд ажиллах. Туршлагатай хүн давуу.", requirements: ["Барилгын ажлын туршлага давуу", "Биеийн эрүүл мэнд"], responsibilities: ["Барилгын материал зөөх", "Бетон цутгах", "Арматур ажил"], benefits: ["Өдрийн цалин өндөр", "Хоол өгнө"], salaryMin: 2500000, salaryMax: 3500000, location: "서울", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Агуулахын менежер", company: companies[7], category: categories[2], description: "Инчоний агуулахад бараа хүлээн авах, хянах, менежмент хийх.", requirements: ["Солонгос хэл дунд түвшин", "Компьютер ашиглах чадвар", "Жолооны үнэмлэх давуу"], responsibilities: ["Бараа хүлээн авах", "Инвентарь хөтлөх", "Ажилтнуудыг удирдах"], benefits: ["Менежерийн нэмэгдэл", "Байр өгнө"], salaryMin: 2500000, salaryMax: 3200000, location: "인천", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Загас боловсруулах ажилтан", company: companies[8], category: categories[5], description: "Бусан дахь загас боловсруулах үйлдвэрт ажиллах.", requirements: ["Хүйтэнд тэсвэртэй", "Эрүүл мэндийн шинжилгээ"], responsibilities: ["Загас цэвэрлэх", "Савлах", "Хөлдөөх процесс"], benefits: ["Байр, хоол өгнө", "Загасны бүтээгдэхүүн авах боломж"], salaryMin: 2000000, salaryMax: 2600000, location: "부산", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Оёдолчин (봉제사)", company: companies[9], category: categories[6], description: "Дэгү дэх нэхмэлийн үйлдвэрт хувцас оёх ажил.", requirements: ["Оёдлын туршлага", "Оёдлын машин ажиллуулах чадвар"], responsibilities: ["Хувцас оёх", "Чанарын шалгалт", "Загварын дагуу оёх"], benefits: ["Бүтээмжийн нэмэгдэл", "Байр өгнө"], salaryMin: 2000000, salaryMax: 2800000, location: "대구", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Зочид буудлын үйлчлэгч", company: companies[10], category: categories[8], description: "Жэжү арлын зочид буудалд өрөө цэвэрлэх, үйлчлэх.", requirements: ["Цэвэрч нямбай", "Солонгос хэл суурь түвшин"], responsibilities: ["Өрөө цэвэрлэх", "Зочдод үйлчлэх", "Бараа нөхөн дүүргэх"], benefits: ["Байр, хоол", "Жэжү арлын үзэсгэлэнт газруудаар аялах"], salaryMin: 2000000, salaryMax: 2400000, location: "제주도", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Электроникийн угсралтчин", company: companies[11], category: categories[0], description: "Кванжү дахь электроникийн үйлдвэрт эд анги угсрах.", requirements: ["Нарийн ажил хийх чадвартай", "Ээлжээр ажиллах"], responsibilities: ["Электрон эд анги угсрах", "Гагнуурын ажил", "Шалгалт хийх"], benefits: ["Байр өгнө", "Илүү цагийн нэмэгдэл"], salaryMin: 2100000, salaryMax: 2700000, location: "광주", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Тогооч (주방보조)", company: companies[10], category: categories[8], description: "Жэжү арлын ресторанд Монгол болон Солонгос хоол хийх.", requirements: ["Хоол хийх туршлага", "Эрүүл мэндийн шинжилгээ"], responsibilities: ["Хоол бэлтгэх", "Гал тогооны цэвэрлэгээ", "Бараа захиалах"], benefits: ["Хоол өгнө", "Байр өгнө", "Тип авах боломж"], salaryMin: 2200000, salaryMax: 2800000, location: "제주도", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Хүнд даацын жолооч", company: companies[2], category: categories[9], description: "CJ логистикийн ачааны машин жолоодох.", requirements: ["Солонгосын жолооны үнэмлэх (1종)", "2+ жил туршлага"], responsibilities: ["Ачаа тээвэрлэх", "Хүргэлт хийх", "Машины арчилгаа"], benefits: ["Өндөр цалин", "Шатахууны зардал", "Илүү цагийн нэмэгдэл"], salaryMin: 3000000, salaryMax: 4000000, location: "경기도", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Орчуулагч (Монгол-Солонгос)", company: companies[1], category: categories[11], description: "Hyundai-ийн үйлдвэрт Монгол ажилтнуудад орчуулга хийх.", requirements: ["TOPIK 4+ түвшин", "Монгол, Солонгос хэл чөлөөтэй"], responsibilities: ["Үйлдвэрийн заавар орчуулах", "Хурал дээр орчуулах", "Баримт бичиг орчуулах"], benefits: ["Оффисын ажил", "Өндөр цалин", "Ахих боломж"], salaryMin: 2800000, salaryMax: 3500000, location: "서울", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Хөдөө аж ахуйн ажилтан (농장)", company: companies[5], category: categories[4], description: "Чүнчоннам дахь фермд ногоо тарих, хураах ажил.", requirements: ["Хөдөө аж ахуйн туршлага давуу", "Биеийн тамир сайн"], responsibilities: ["Ногоо тарих", "Хураалт хийх", "Хүлэмж арчлах"], benefits: ["Байр, хоол", "Улирлын урамшуулал"], salaryMin: 2000000, salaryMax: 2500000, location: "충청남도", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Цэвэрлэгээний ажилтан", company: companies[6], category: categories[7], description: "Сөүл дэх оффисын барилга, дэлгүүрийн цэвэрлэгээ.", requirements: ["Цэвэрч нямбай", "Солонгос хэл суурь"], responsibilities: ["Оффис цэвэрлэх", "Шал угаах", "Хог зайлуулах"], benefits: ["Богино цагийн ажил боломжтой", "Тээвэр"], salaryMin: 1800000, salaryMax: 2200000, location: "서울", type: "PART_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Ган хийцийн гагнуурчин", company: companies[4], category: categories[1], description: "POSCO-ийн барилгын ган хийц гагнах ажил.", requirements: ["Гагнуурын мэргэжил", "Гагнуурын үнэмлэх давуу"], responsibilities: ["Ган хийц гагнах", "Зураг унших", "Аюулгүй ажиллагаа"], benefits: ["Мэргэжлийн нэмэгдэл", "Байр, хоол", "Аюулын даатгал"], salaryMin: 2800000, salaryMax: 3800000, location: "경상남도", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
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
        location: job.location,
        type: job.type,
        mode: job.mode,
        experience: job.experience,
        companyId: job.company.id,
        categoryId: job.category.id,
      },
    });
  }

  console.log("Seeded: 12 companies, 12 categories, 18 jobs");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
