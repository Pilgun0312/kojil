"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { CategoryGrid } from "@/components/category-grid";
import { Filters } from "@/components/filters";
import { JobCard } from "@/components/job-card";
import { JobDetail } from "@/components/job-detail";
import { PostJob } from "@/components/post-job";
import { SavedJobsSheet } from "@/components/saved-jobs-sheet";
import { ApplicationsSheet } from "@/components/applications-sheet";
import { Footer } from "@/components/footer";
import { useJobs, useSavedJobs, useToggleSave } from "@/lib/api";
import { Briefcase, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const { data: jobs, isLoading } = useJobs();
  const { data: savedJobs } = useSavedJobs();
  const toggleSave = useToggleSave();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const savedIds = new Set(savedJobs?.map((s) => s.jobId) || []);

  return (
    <>
      <Header
        onOpenSaved={() => setShowSaved(true)}
        onOpenApplications={() => setShowApplications(true)}
        onOpenPostJob={() => setShowPostJob(true)}
      />

      <Hero />
      <CategoryGrid />

      <main className="mx-auto max-w-7xl px-4 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-600" />
            Ажлын зарууд
            {jobs && <span className="text-sm font-normal text-muted-foreground">({jobs.length})</span>}
          </h2>
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <Filter className="mr-1 h-4 w-4" /> Шүүлт
          </Button>
        </div>

        <div className="flex gap-6">
          <aside className={`w-64 shrink-0 ${showMobileFilters ? "block" : "hidden"} md:block`}>
            <Filters />
          </aside>

          <div className="flex-1 space-y-3">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border p-4">
                    <div className="h-5 w-2/3 rounded bg-muted mb-2" />
                    <div className="h-4 w-1/3 rounded bg-muted mb-3" />
                    <div className="flex gap-2">
                      <div className="h-5 w-20 rounded bg-muted" />
                      <div className="h-5 w-16 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {jobs?.length === 0 && !isLoading && (
              <div className="rounded-lg border p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-semibold">Ажлын зар олдсонгүй</h3>
                <p className="text-sm text-muted-foreground mt-1">Шүүлтүүрээ өөрчлөөд дахин хайна уу</p>
              </div>
            )}
            {jobs?.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedIds.has(job.id)}
                onToggleSave={() => toggleSave.mutate(job.id)}
                onClick={() => setSelectedJobId(job.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <JobDetail jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
      <PostJob open={showPostJob} onClose={() => setShowPostJob(false)} />
      <SavedJobsSheet open={showSaved} onClose={() => setShowSaved(false)} onSelectJob={setSelectedJobId} />
      <ApplicationsSheet open={showApplications} onClose={() => setShowApplications(false)} />
    </>
  );
}
