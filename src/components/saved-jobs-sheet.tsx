"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useSavedJobs, useToggleSave } from "@/lib/api";
import { formatSalary } from "@/lib/constants";
import { Bookmark, Building2, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectJob: (id: string) => void;
}

export function SavedJobsSheet({ open, onClose, onSelectJob }: Props) {
  const { data: saved } = useSavedJobs();
  const toggleSave = useToggleSave();

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-emerald-600" /> Хадгалсан ажлууд
          </SheetTitle>
          <SheetDescription>{saved?.length || 0} ажил хадгалсан</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {saved?.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Хадгалсан ажил байхгүй</p>}
          {saved?.map((s) => (
            <div
              key={s.id}
              className="cursor-pointer rounded-lg border p-3 transition hover:border-emerald-500"
              onClick={() => { onSelectJob(s.job.id); onClose(); }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{s.job.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3" /> {s.job.company.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {s.job.location}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSave.mutate(s.job.id); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <Badge variant="outline" className="mt-2 text-emerald-700 dark:text-emerald-400 text-xs">
                {formatSalary(s.job.salaryMin, s.job.salaryMax)}
              </Badge>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
