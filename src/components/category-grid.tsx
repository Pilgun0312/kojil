"use client";

import { useCategories } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Monitor, Calculator, TrendingUp, Wrench, Users, Palette, GraduationCap, Heart, Building, Truck, Scale, Headphones } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor, Calculator, TrendingUp, Wrench, Users, Palette, GraduationCap, Heart, Building, Truck, Scale, Headphones,
};

export function CategoryGrid() {
  const { data: categories } = useCategories();
  const { setFilter, filters } = useAppStore();

  if (!categories) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-4 text-xl font-bold">Ангилалаар хайх</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon || "Monitor"] || Monitor;
          const active = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter("category", active ? "" : cat.id)}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 ${active ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950" : ""}`}
            >
              <Icon className={`h-6 w-6 ${active ? "text-emerald-600" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium text-center">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat._count?.jobs || 0} зар</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
