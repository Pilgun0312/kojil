import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Briefcase className="h-5 w-5 text-emerald-600" />
          <span className="font-bold">АжилМн</span>
        </div>
        <p className="text-sm text-muted-foreground">Гадаад дахь Монголчуудын ажлын зар платформ</p>
        <p className="mt-2 text-xs text-muted-foreground">&copy; 2026 АжилМн. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </footer>
  );
}
