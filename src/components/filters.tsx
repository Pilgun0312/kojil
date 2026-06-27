"use client";

import { useAppStore } from "@/lib/store";
import { useCategories } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JOB_TYPES, JOB_MODES, EXPERIENCE_LEVELS } from "@/lib/constants";
import { X } from "lucide-react";

export function Filters() {
  const { filters, setFilter, clearFilters } = useAppStore();
  const { data: categories } = useCategories();

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Шүүлтүүр</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" /> Цэвэрлэх
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Ангилал</label>
          <Select value={filters.category} onValueChange={(v) => setFilter("category", v === "all" ? "" : v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Бүгд" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Ажлын төрөл</label>
          <Select value={filters.type} onValueChange={(v) => setFilter("type", v === "all" ? "" : v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Бүгд" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              {Object.entries(JOB_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Ажлын горим</label>
          <Select value={filters.mode} onValueChange={(v) => setFilter("mode", v === "all" ? "" : v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Бүгд" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              {Object.entries(JOB_MODES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted-foreground">Туршлага</label>
          <Select value={filters.experience} onValueChange={(v) => setFilter("experience", v === "all" ? "" : v ?? "")}>
            <SelectTrigger><SelectValue placeholder="Бүгд" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүгд</SelectItem>
              {Object.entries(EXPERIENCE_LEVELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
