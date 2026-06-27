"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, MapPin, Clock, Eye, Building2 } from "lucide-react";
import { Job } from "@/lib/api";
import { JOB_TYPES, JOB_MODES, KOREA_PREFECTURES, formatSalary, timeAgo } from "@/lib/constants";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: () => void;
  onClick: () => void;
}

export function JobCard({ job, isSaved, onToggleSave, onClick }: JobCardProps) {
  return (
    <div
      className="group cursor-pointer rounded-lg border p-4 transition hover:border-emerald-500 hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold group-hover:text-emerald-600 truncate">{job.title}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.company.name}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        >
          {isSaved
            ? <BookmarkCheck className="h-4 w-4 text-emerald-600" />
            : <Bookmark className="h-4 w-4" />
          }
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{JOB_TYPES[job.type] || job.type}</Badge>
        <Badge variant="secondary">{JOB_MODES[job.mode] || job.mode}</Badge>
        <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400">
          {formatSalary(job.salaryMin, job.salaryMax)}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{KOREA_PREFECTURES[job.location] || job.location}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.createdAt)}</span>
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{job.views}</span>
      </div>
    </div>
  );
}
