"use client";

import { Briefcase, Moon, Sun, Bookmark, FileText, Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./providers";
import { useState } from "react";

interface HeaderProps {
  onOpenSaved: () => void;
  onOpenApplications: () => void;
  onOpenPostJob: () => void;
}

export function Header({ onOpenSaved, onOpenApplications, onOpenPostJob }: HeaderProps) {
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">АжилМн</span>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" onClick={onOpenSaved}>
            <Bookmark className="mr-1 h-4 w-4" /> Хадгалсан
          </Button>
          <Button variant="ghost" size="sm" onClick={onOpenApplications}>
            <FileText className="mr-1 h-4 w-4" /> Горилолтууд
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onOpenPostJob}>
            <Plus className="mr-1 h-4 w-4" /> Зар нийтлэх
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {menuOpen && (
        <div className="border-t p-4 md:hidden space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => { onOpenSaved(); setMenuOpen(false); }}>
            <Bookmark className="mr-2 h-4 w-4" /> Хадгалсан ажлууд
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => { onOpenApplications(); setMenuOpen(false); }}>
            <FileText className="mr-2 h-4 w-4" /> Миний горилолтууд
          </Button>
          <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { onOpenPostJob(); setMenuOpen(false); }}>
            <Plus className="mr-2 h-4 w-4" /> Зар нийтлэх
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={toggle}>
            {dark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {dark ? "Цайвар горим" : "Харанхуй горим"}
          </Button>
        </div>
      )}
    </header>
  );
}
