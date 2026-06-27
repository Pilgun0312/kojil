"use client";

import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStats } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export function Hero() {
  const { data: stats } = useStats();
  const { setSearchQuery, setLocationQuery } = useAppStore();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    setSearchQuery(search);
    setLocationQuery(location);
  };

  return (
    <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-3 text-3xl font-bold md:text-5xl">Ирээдүйн ажлаа олоорой</h1>
        <p className="mb-8 text-emerald-100 text-lg">
          {stats ? `${stats.jobs} ажлын зар • ${stats.companies} компани • ${stats.categories} ангилал` : "Монголын ажлын зар №1 платформ"}
        </p>

        <div className="flex flex-col gap-3 rounded-xl bg-white/10 p-4 backdrop-blur sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
            <Input
              placeholder="Албан тушаал, компани хайх..."
              className="border-0 bg-white/20 pl-10 text-white placeholder:text-emerald-200 focus-visible:ring-emerald-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
            <Input
              placeholder="Байршил..."
              className="border-0 bg-white/20 pl-10 text-white placeholder:text-emerald-200 focus-visible:ring-emerald-300"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold" onClick={handleSearch}>
            Хайх
          </Button>
        </div>
      </div>
    </section>
  );
}
