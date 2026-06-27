"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJob, useApplyMutation } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { JOB_TYPES, JOB_MODES, EXPERIENCE_LEVELS, getPrefectureLabel, formatSalary, APPLICATION_STATUS } from "@/lib/constants";
import { MapPin, Building2, Eye, Users, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  jobId: string | null;
  onClose: () => void;
}

export function JobDetail({ jobId, onClose }: Props) {
  const { data: job } = useJob(jobId);
  const applyMutation = useApplyMutation();
  const { setUserEmail } = useAppStore();
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", expectedSalary: "", coverLetter: "" });

  const handleApply = async () => {
    if (!jobId || !form.fullName || !form.email) return;
    await applyMutation.mutateAsync({
      jobId,
      data: { ...form, expectedSalary: form.expectedSalary ? parseInt(form.expectedSalary) : undefined },
    });
    setUserEmail(form.email);
    setApplied(true);
  };

  const handleClose = () => {
    setApplied(false);
    setForm({ fullName: "", email: "", phone: "", expectedSalary: "", coverLetter: "" });
    onClose();
  };

  return (
    <Dialog open={!!jobId} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {job && (
          <>
            <DialogHeader>
              <DialogTitle>{job.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 pt-1">
                <Building2 className="h-4 w-4" /> {job.company.name} • <MapPin className="h-4 w-4" /> {getPrefectureLabel(job.location, job.country || "KR")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="secondary">{JOB_TYPES[job.type]}</Badge>
              <Badge variant="secondary">{JOB_MODES[job.mode]}</Badge>
              {job.experience && <Badge variant="secondary">{EXPERIENCE_LEVELS[job.experience]}</Badge>}
              <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </Badge>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {job.views} үзсэн</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {job._count?.applications || 0} горилогч</span>
            </div>

            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Дэлгэрэнгүй</TabsTrigger>
                <TabsTrigger value="apply" className="flex-1">Горилох</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Тайлбар</h4>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </div>
                {job.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Шаардлага</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {job.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Үүрэг хариуцлага</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {job.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Давуу тал</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                )}
                {job.company.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Компаний тухай</h4>
                    <p className="text-sm text-muted-foreground">{job.company.description}</p>
                    {job.company.size && <p className="text-sm text-muted-foreground mt-1">Ажилтны тоо: {job.company.size}</p>}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="apply" className="mt-4">
                {applied ? (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-600" />
                    <h4 className="text-lg font-semibold">Амжилттай илгээгдлээ!</h4>
                    <p className="text-sm text-muted-foreground">Таны горилолт "{APPLICATION_STATUS.PENDING}" төлөвтэй байна.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label>Бүтэн нэр *</Label>
                      <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Овог нэр" />
                    </div>
                    <div>
                      <Label>И-мэйл *</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@mail.com" />
                    </div>
                    <div>
                      <Label>Утасны дугаар</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9911-2233" />
                    </div>
                    <div>
                      <Label>Хүсэх цалин (₮)</Label>
                      <Input type="number" value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} placeholder="3000000" />
                    </div>
                    <div>
                      <Label>Товч танилцуулга</Label>
                      <Textarea value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="Яагаад энэ ажилд горилж байгаагаа бичнэ үү..." rows={4} />
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleApply}
                      disabled={!form.fullName || !form.email || applyMutation.isPending}
                    >
                      {applyMutation.isPending ? "Илгээж байна..." : "Горилох"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
