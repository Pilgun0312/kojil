"use client";

import { useAppStore } from "@/lib/store";
import { COUNTRIES, type CountryCode } from "@/lib/constants";

export function CountryToggle() {
  const { country, setCountry } = useAppStore();

  return (
    <div className="flex gap-0 overflow-hidden rounded-lg border-2 border-white/30">
      {(Object.entries(COUNTRIES) as [CountryCode, typeof COUNTRIES[CountryCode]][]).map(([code, info]) => (
        <button
          key={code}
          onClick={() => setCountry(code)}
          className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${
            country === code
              ? "bg-white text-emerald-700 shadow-md"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {info.flag} {info.label}
        </button>
      ))}
    </div>
  );
}
