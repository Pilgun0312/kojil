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
    prisma.company.create({ data: { name: "Голомт Банк", industry: "Санхүү", location: "Улаанбаатар", description: "Монголын тэргүүлэгч арилжааны банк", size: "1000+" } }),
    prisma.company.create({ data: { name: "Mobicom", industry: "Харилцаа холбоо", location: "Улаанбаатар", description: "Монголын хамгийн том мобайл оператор", size: "500-1000" } }),
    prisma.company.create({ data: { name: "Unitel", industry: "Харилцаа холбоо", location: "Улаанбаатар", description: "Дижитал шийдэл, мобайл үйлчилгээ", size: "500-1000" } }),
    prisma.company.create({ data: { name: "Оюу Толгой", industry: "Уул уурхай", location: "Өмнөговь", description: "Дэлхийн түвшний зэс-алтны уурхай", size: "1000+" } }),
    prisma.company.create({ data: { name: "Эрдэнэт Үйлдвэр", industry: "Уул уурхай", location: "Эрдэнэт", description: "Монголын хамгийн том зэсийн үйлдвэр", size: "1000+" } }),
    prisma.company.create({ data: { name: "Хаан Банк", industry: "Санхүү", location: "Улаанбаатар", description: "Монголын хамгийн олон салбартай банк", size: "1000+" } }),
    prisma.company.create({ data: { name: "AND Global", industry: "Технологи", location: "Улаанбаатар", description: "Програм хангамж хөгжүүлэлт, IT шийдэл", size: "50-200" } }),
    prisma.company.create({ data: { name: "Ard Holdings", industry: "Санхүү", location: "Улаанбаатар", description: "Санхүүгийн технологи, хөрөнгө оруулалт", size: "200-500" } }),
    prisma.company.create({ data: { name: "Nomin Holdings", industry: "Худалдаа", location: "Улаанбаатар", description: "Монголын тэргүүлэгч худалдааны сүлжээ", size: "1000+" } }),
    prisma.company.create({ data: { name: "MCS Group", industry: "Олон салбарт", location: "Улаанбаатар", description: "Монголын хамгийн том бизнес группын нэг", size: "1000+" } }),
    prisma.company.create({ data: { name: "Монгол Шуудан", industry: "Логистик", location: "Улаанбаатар", description: "Монголын Шуудан Холбооны үйлчилгээ", size: "500-1000" } }),
    prisma.company.create({ data: { name: "Ачлалт Групп", industry: "Технологи", location: "Улаанбаатар", description: "Э-коммерц, дижитал маркетинг", size: "50-200" } }),
  ]);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Мэдээллийн технологи", icon: "Monitor" } }),
    prisma.category.create({ data: { name: "Санхүү, Нягтлан бодох", icon: "Calculator" } }),
    prisma.category.create({ data: { name: "Маркетинг, Борлуулалт", icon: "TrendingUp" } }),
    prisma.category.create({ data: { name: "Инженер, Техник", icon: "Wrench" } }),
    prisma.category.create({ data: { name: "Хүний нөөц", icon: "Users" } }),
    prisma.category.create({ data: { name: "Дизайн, Урлаг", icon: "Palette" } }),
    prisma.category.create({ data: { name: "Боловсрол, Сургалт", icon: "GraduationCap" } }),
    prisma.category.create({ data: { name: "Эрүүл мэнд", icon: "Heart" } }),
    prisma.category.create({ data: { name: "Барилга, Архитектур", icon: "Building" } }),
    prisma.category.create({ data: { name: "Логистик, Тээвэр", icon: "Truck" } }),
    prisma.category.create({ data: { name: "Хууль, Эрх зүй", icon: "Scale" } }),
    prisma.category.create({ data: { name: "Үйлчилгээ", icon: "Headphones" } }),
  ]);

  const jobs = [
    { title: "Senior Frontend Хөгжүүлэгч", company: companies[6], category: categories[0], description: "React, Next.js дээр суурилсан вэб аппликейшн хөгжүүлэх. Манай баг дижитал бүтээгдэхүүнүүдийг хөгжүүлж байгаа бөгөөд танд тэргүүлэгч үүрэг хариуцлага оногдоно.", requirements: ["React/Next.js 3+ жил", "TypeScript", "REST API, GraphQL"], responsibilities: ["UI компонент хөгжүүлэх", "Код ревью хийх", "Баг удирдах"], benefits: ["Уян хатан цагийн хуваарь", "Эрүүл мэндийн даатгал", "Сургалтын төлбөр"], salaryMin: 3000000, salaryMax: 5000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "HYBRID", experience: "SENIOR" },
    { title: "Backend Инженер", company: companies[6], category: categories[0], description: "Node.js, PostgreSQL ашиглан серверийн тал хөгжүүлэх. Микро-сервис архитектурын дагуу системийг өргөжүүлнэ.", requirements: ["Node.js 2+ жил", "PostgreSQL", "Docker"], responsibilities: ["API endpoint хөгжүүлэх", "Өгөгдлийн сангийн оновчлол", "CI/CD pipeline"], benefits: ["Алслаас ажиллах боломж", "Стоков опцион"], salaryMin: 2500000, salaryMax: 4500000, location: "Улаанбаатар", type: "FULL_TIME", mode: "REMOTE", experience: "MID" },
    { title: "Санхүүгийн шинжээч", company: companies[0], category: categories[1], description: "Банкны санхүүгийн тайлан, шинжилгээ хийх. Зээлийн эрсдэлийн үнэлгээ болон хөрөнгийн портфолио удирдлагад оролцоно.", requirements: ["Санхүүгийн мэргэжлээр бакалавр", "Excel дээд түвшин", "CFA давуу тал"], responsibilities: ["Санхүүгийн тайлан бэлтгэх", "Эрсдэлийн шинжилгээ", "Хөрөнгө оруулалтын зөвлөмж"], benefits: ["Өрсөлдөхүйц цалин", "Ахих боломж", "Урамшуулал"], salaryMin: 2000000, salaryMax: 3500000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Дижитал Маркетингийн Менежер", company: companies[11], category: categories[2], description: "Э-коммерсийн дижитал маркетингийн стратеги боловсруулах, хэрэгжүүлэх.", requirements: ["Маркетингийн 3+ жил туршлага", "Google Ads, Facebook Ads", "SEO/SEM"], responsibilities: ["Маркетингийн кампанит ажил", "Контент стратеги", "Аналитик тайлан"], benefits: ["KPI урамшуулал", "Дижитал номын сан"], salaryMin: 2000000, salaryMax: 3000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "HYBRID", experience: "MID" },
    { title: "Уул уурхайн Инженер", company: companies[3], category: categories[3], description: "Оюу Толгойн далд уурхайн инженерийн ажлыг хариуцна. Олон улсын стандартын дагуу аюулгүй ажиллагааг хангана.", requirements: ["Уул уурхайн инженерийн мэргэжил", "5+ жил туршлага", "Англи хэл"], responsibilities: ["Уурхайн төлөвлөлт", "Аюулгүй ажиллагаа", "Тоног төхөөрөмжийн хяналт"], benefits: ["Өндөр цалин", "Амралтын хуваарь", "Тээвэр, байр"], salaryMin: 5000000, salaryMax: 8000000, location: "Өмнөговь", type: "FULL_TIME", mode: "ONSITE", experience: "SENIOR" },
    { title: "HR Менежер", company: companies[9], category: categories[4], description: "Хүний нөөцийн бодлого боловсруулах, ажилтан сонгон шалгаруулах, сургалт зохион байгуулах.", requirements: ["HR-ийн 3+ жил туршлага", "Хөдөлмөрийн эрх зүй"], responsibilities: ["Ажилтан сонгох", "Гүйцэтгэлийн үнэлгээ", "Сургалт зохион байгуулах"], benefits: ["Мэргэжил дээшлүүлэх", "Эрүүл мэндийн даатгал"], salaryMin: 2000000, salaryMax: 3000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "UX/UI Дизайнер", company: companies[7], category: categories[5], description: "Мобайл болон вэб аппликейшний хэрэглэгчийн туршлагыг дизайлах.", requirements: ["Figma, Sketch", "UX судалгааны арга зүй", "Портфолио"], responsibilities: ["Wireframe, Prototype", "Хэрэглэгчийн судалгаа", "Дизайн систем"], benefits: ["Бүтээлч орчин", "Уян цагийн хуваарь"], salaryMin: 2000000, salaryMax: 3500000, location: "Улаанбаатар", type: "FULL_TIME", mode: "HYBRID", experience: "MID" },
    { title: "Мэдээллийн системийн Мэргэжилтэн", company: companies[5], category: categories[0], description: "Банкны мэдээллийн системийг хөгжүүлэх, засвар үйлчилгээ хийх.", requirements: ["Java/C#", "SQL", "Банкны систем"], responsibilities: ["Системийн хөгжүүлэлт", "Алдааны засвар", "Баримт бичиг"], benefits: ["Тогтвортой ажлын байр", "Урамшуулал"], salaryMin: 2500000, salaryMax: 4000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Нягтлан бодогч", company: companies[8], category: categories[1], description: "Нягтлан бодох бүртгэлийн ажлыг хариуцна.", requirements: ["Нягтлан бодох бүртгэлийн мэргэжил", "2+ жил туршлага"], responsibilities: ["Санхүүгийн тайлан", "Татварын тооцоо", "Аудитын бэлтгэл"], benefits: ["Тогтвортой цалин", "Бонус"], salaryMin: 1500000, salaryMax: 2500000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Борлуулалтын Мэргэжилтэн", company: companies[1], category: categories[2], description: "Mobicom-ын бүтээгдэхүүн, үйлчилгээний борлуулалтыг нэмэгдүүлэх.", requirements: ["Борлуулалтын туршлага", "Харилцааны ур чадвар"], responsibilities: ["Үйлчлүүлэгчтэй харилцах", "Борлуулалтын зорилго хэрэгжүүлэх"], benefits: ["Борлуулалтын шимтгэл", "Утасны хөнгөлөлт"], salaryMin: 1500000, salaryMax: 3000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "Mobile Хөгжүүлэгч (React Native)", company: companies[2], category: categories[0], description: "Unitel-ын мобайл аппликейшнийг React Native дээр хөгжүүлэх.", requirements: ["React Native 2+ жил", "iOS/Android мэдлэг", "TypeScript"], responsibilities: ["Мобайл апп хөгжүүлэх", "Гүйцэтгэлийн оновчлол", "App Store/Play Store нийтлэх"], benefits: ["Технологийн тэтгэлэг", "Алслаас ажиллах"], salaryMin: 3000000, salaryMax: 5000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "REMOTE", experience: "MID" },
    { title: "Логистикийн Зохицуулагч", company: companies[10], category: categories[9], description: "Шуудан хүргэлтийн логистик төлөвлөлт, зохицуулалт хийх.", requirements: ["Логистикийн туршлага", "B жолооны үнэмлэх"], responsibilities: ["Хүргэлтийн маршрут", "Нөөц удирдлага", "Тайлан бэлтгэх"], benefits: ["Тээврийн хөнгөлөлт", "Нэмэгдэл"], salaryMin: 1200000, salaryMax: 2000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "JUNIOR" },
    { title: "Эрүүл мэндийн Зөвлөх", company: companies[9], category: categories[7], description: "Ажилтнуудын эрүүл мэндийн хөтөлбөр удирдах.", requirements: ["Анагаах ухааны мэргэжил", "3+ жил туршлага"], responsibilities: ["Эрүүл мэндийн зөвлөгөө", "Урьдчилан сэргийлэх хөтөлбөр"], benefits: ["Мэргэжлийн хөгжил", "Даатгал"], salaryMin: 2500000, salaryMax: 4000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Хууль зүйн Зөвлөх", company: companies[0], category: categories[10], description: "Банкны хуулийн асуудлыг хариуцах, гэрээ хянах.", requirements: ["Хуулийн мэргэжил", "Банк, санхүүгийн хууль"], responsibilities: ["Гэрээ боловсруулах", "Хуулийн зөвлөгөө", "Маргаан шийдвэрлэх"], benefits: ["Мэргэшлийн сургалт", "Өрсөлдөхүйц цалин"], salaryMin: 3000000, salaryMax: 5000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "SENIOR" },
    { title: "Дадлагажигч - Програм хангамж", company: companies[7], category: categories[0], description: "Ard Holdings-ийн IT багт дадлага хийх боломж.", requirements: ["CS оюутан", "Суурь програмчлалын мэдлэг"], responsibilities: ["Ахлах хөгжүүлэгчтэй ажиллах", "Код бичих, тест хийх"], benefits: ["Менторшип", "Ажилд орох боломж"], salaryMin: 800000, salaryMax: 1200000, location: "Улаанбаатар", type: "INTERN", mode: "ONSITE", experience: "ENTRY" },
    { title: "Барилгын Инженер", company: companies[9], category: categories[8], description: "Барилга байгууламжийн зураг төсөл, хяналт хийх.", requirements: ["Барилгын инженерийн мэргэжил", "AutoCAD", "3+ жил"], responsibilities: ["Зураг төсөл", "Барилгын хяналт", "Чанарын баталгаа"], benefits: ["Төслийн урамшуулал", "Тээвэр"], salaryMin: 2500000, salaryMax: 4000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "MID" },
    { title: "Үйлчлүүлэгчийн Үйлчилгээний Мэргэжилтэн", company: companies[1], category: categories[11], description: "Mobicom-ын үйлчлүүлэгчдэд утсаар болон биечлэн үйлчлэх.", requirements: ["Харилцааны ур чадвар", "Компьютерийн мэдлэг"], responsibilities: ["Үйлчлүүлэгчийн асуудал шийдвэрлэх", "Бүтээгдэхүүний мэдээлэл өгөх"], benefits: ["Сургалт", "Утасны хөнгөлөлт", "Ээлжийн нэмэгдэл"], salaryMin: 1000000, salaryMax: 1500000, location: "Улаанбаатар", type: "FULL_TIME", mode: "ONSITE", experience: "ENTRY" },
    { title: "DevOps Инженер", company: companies[6], category: categories[0], description: "Cloud дэд бүтэц удирдах, CI/CD систем хөгжүүлэх.", requirements: ["AWS/GCP", "Docker, Kubernetes", "Linux"], responsibilities: ["Дэд бүтцийн автоматжуулалт", "Мониторинг", "Аюулгүй байдал"], benefits: ["Алслаас ажиллах", "Технологийн тэтгэлэг", "Сертификатын дэмжлэг"], salaryMin: 3500000, salaryMax: 6000000, location: "Улаанбаатар", type: "FULL_TIME", mode: "REMOTE", experience: "SENIOR" },
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
