export const SITE_NAME = "АжилМн";
export const SITE_DESCRIPTION = "Солонгос дахь Монголчуудын ажлын зар №1 платформ";

export const KOREA_PREFECTURES: Record<string, string> = {
  "서울": "Сөүл (서울)",
  "부산": "Бусан (부산)",
  "대구": "Дэгү (대구)",
  "인천": "Инчон (인천)",
  "광주": "Кванжү (광주)",
  "대전": "Дэжон (대전)",
  "울산": "Үльсан (울산)",
  "세종": "Сэжон (세종)",
  "경기도": "Кёнги до (경기도)",
  "강원도": "Канвон до (강원도)",
  "충청북도": "Чүнчонбүк до (충청북도)",
  "충청남도": "Чүнчоннам до (충청남도)",
  "전북": "Жонбүк (전북)",
  "전라남도": "Жолланам до (전라남도)",
  "경상북도": "Кёнсанбүк до (경상북도)",
  "경상남도": "Кёнсаннам до (경상남도)",
  "제주도": "Жэжү до (제주도)",
};

export const JOB_TYPES: Record<string, string> = {
  FULL_TIME: "Бүтэн цагийн",
  PART_TIME: "Цагийн",
  CONTRACT: "Гэрээт",
  INTERN: "Дадлагажигч",
};

export const JOB_MODES: Record<string, string> = {
  ONSITE: "Оффист",
  REMOTE: "Алслаас",
  HYBRID: "Холимог",
};

export const EXPERIENCE_LEVELS: Record<string, string> = {
  ENTRY: "Туршлагагүй",
  JUNIOR: "1-2 жил",
  MID: "3-5 жил",
  SENIOR: "5+ жил",
  LEAD: "Удирдах түвшин",
};

export const APPLICATION_STATUS: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  REVIEWED: "Үзсэн",
  ACCEPTED: "Зөвшөөрөгдсөн",
  REJECTED: "Татгалзсан",
};

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Тохиролцоно";
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}сая`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}мян`;
    return n.toString();
  };
  if (min && max) return `₮${fmt(min)} - ₮${fmt(max)}`;
  if (min) return `₮${fmt(min)}-с дээш`;
  return `₮${fmt(max!)} хүртэл`;
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} минутын өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цагийн өмнө`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  return d.toLocaleDateString("mn-MN");
}
