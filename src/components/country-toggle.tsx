"use client";

import { useAppStore } from "@/lib/store";
import { COUNTRIES, type CountryCode } from "@/lib/constants";

export function CountryToggle() {
  const { country, setCountry } = useAppStore();

  return (
    <div className="inline-flex rounded-xl overflow-hidden shadow-lg">
      {(Object.entries(COUNTRIES) as [CountryCode, typeof COUNTRIES[CountryCode]][]).map(([code, info]) => (
        <button
          key={code}
          onClick={() => setCountry(code)}
          className={`px-6 py-3 text-base font-bold transition-all whitespace-nowrap ${
            country === code
              ? "bg-white text-emerald-700 shadow-inner"
              : "bg-emerald-900/50 text-emerald-100 hover:bg-emerald-900/70"
          }`}
        >
          {info.flag} {info.label}
        </button>
      ))}
    </div>
  );
}
