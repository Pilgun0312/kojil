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

export const COUNTRIES = {
  JP: { label: "Япон дахь ажил", flag: "🇯🇵", currency: "JPY", symbol: "¥" },
  KR: { label: "Солонгос дахь ажил", flag: "🇰🇷", currency: "KRW", symbol: "₩" },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const JAPAN_PREFECTURES: Record<string, string> = {
  "東京": "Токио (東京)",
  "大阪": "Осака (大阪)",
  "名古屋": "Нагоя (名古屋)",
  "横浜": "Ёкохама (横浜)",
  "福岡": "Фүкүока (福岡)",
  "札幌": "Саппоро (札幌)",
  "神戸": "Кобэ (神戸)",
  "京都": "Киото (京都)",
  "広島": "Хирошима (広島)",
  "仙台": "Сэндай (仙台)",
  "千葉": "Чиба (千葉)",
  "埼玉": "Сайтама (埼玉)",
  "北海道": "Хоккайдо (北海道)",
  "愛知": "Айчи (愛知)",
  "静岡": "Шизүока (静岡)",
  "茨城": "Ибараки (茨城)",
  "群馬": "Гүнма (群馬)",
  "栃木": "Точиги (栃木)",
  "長野": "Нагано (長野)",
  "新潟": "Ниигата (新潟)",
  "三重": "Миэ (三重)",
  "岐阜": "Гифү (岐阜)",
  "富山": "Тояма (富山)",
  "石川": "Ишикава (石川)",
  "熊本": "Күмамото (熊本)",
  "鹿児島": "Кагошима (鹿児島)",
  "沖縄": "Окинава (沖縄)",
};

export function getPrefectures(country: string) {
  return country === "JP" ? JAPAN_PREFECTURES : KOREA_PREFECTURES;
}

export function getPrefectureLabel(location: string, country: string): string {
  const prefs = getPrefectures(country);
  return prefs[location] || location;
}

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

export function formatSalary(min?: number | null, max?: number | null, currency?: string | null): string {
  if (!min && !max) return "Тохиролцоно";
  const symbol = currency === "KRW" ? "₩" : currency === "JPY" ? "¥" : "₮";
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}сая`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}мян`;
    return n.toString();
  };
  if (min && max && min === max) return `${symbol}${fmt(min)}/сар`;
  if (min && max) return `${symbol}${fmt(min)} - ${symbol}${fmt(max)}`;
  if (min) return `${symbol}${fmt(min)}-с дээш`;
  return `${symbol}${fmt(max!)} хүртэл`;
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
