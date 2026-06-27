export const SITE_NAME = "АжилМн";
export const SITE_DESCRIPTION = "Монголын ажлын зар №1 платформ";

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
