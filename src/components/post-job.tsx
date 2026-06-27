"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateJob, useCreateCompany, useCompanies, useCategories } from "@/lib/api";
import { JOB_TYPES, JOB_MODES, EXPERIENCE_LEVELS, getPrefectures, COUNTRIES } from "@/lib/constants";
import { useAppStore } from "@/lib/store";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PostJob({ open, onClose }: Props) {
  const { data: companies } = useCompanies();
  const { data: categories } = useCategories();
  const createJob = useCreateJob();
  const createCompany = useCreateCompany();
  const country = useAppStore((s) => s.country);
  const prefectures = getPrefectures(country);
  const defaultLocation = country === "JP" ? "東京" : "서울";
  const [posted, setPosted] = useState(false);
  const [newCompany, setNewCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: "", industry: "", location: "" });
  const [form, setForm] = useState({
    title: "", description: "", companyId: "", categoryId: "",
    type: "FULL_TIME", mode: "ONSITE", experience: "MID",
    location: defaultLocation, salaryMin: "", salaryMax: "",
    requirements: "", responsibilities: "", benefits: "",
  });

  const handlePost = async () => {
    let companyId = form.companyId;
    if (newCompany && companyForm.name) {
      const c = await createCompany.mutateAsync(companyForm);
      companyId = c.id;
    }
    if (!form.title || !companyId || !form.categoryId) return;

    await createJob.mutateAsync({
      title: form.title,
      description: form.description,
      companyId,
      categoryId: form.categoryId,
      type: form.type,
      mode: form.mode,
      experience: form.experience,
      country,
      currency: COUNTRIES[country].currency,
      location: form.location,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      requirements: form.requirements.split("\n").filter(Boolean),
      responsibilities: form.responsibilities.split("\n").filter(Boolean),
      benefits: form.benefits.split("\n").filter(Boolean),
    });
    setPosted(true);
  };

  const handleClose = () => {
    setPosted(false);
    setNewCompany(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ажлын зар нийтлэх</DialogTitle>
          <DialogDescription>Шинэ ажлын байрны зар оруулах</DialogDescription>
        </DialogHeader>

        {posted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
            <h4 className="text-lg font-semibold">Ажлын зар нийтлэгдлээ!</h4>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label>Албан тушаал *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Frontend Хөгжүүлэгч" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Компани *</Label>
                <Button variant="ghost" size="sm" onClick={() => setNewCompany(!newCompany)}>
                  {newCompany ? "Жагсаалтаас" : "+ Шинэ"}
                </Button>
              </div>
              {newCompany ? (
                <div className="space-y-2">
                  <Input placeholder="Компаний нэр" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} />
                  <Input placeholder="Салбар" value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })} />
                  <Input placeholder="Байршил" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })} />
                </div>
              ) : (
                <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v ?? "" })}>
                  <SelectTrigger><SelectValue placeholder="Компани сонгох" /></SelectTrigger>
                  <SelectContent>
                    {companies?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label>Ангилал *</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Ангилал сонгох" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Төрөл</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v ?? "FULL_TIME" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(JOB_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Горим</Label>
                <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v ?? "ONSITE" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(JOB_MODES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Туршлага</Label>
                <Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v ?? "MID" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(EXPERIENCE_LEVELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Байршил</Label>
              <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v ?? defaultLocation })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(prefectures).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div><Label>Доод цалин (₮)</Label><Input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} /></div>
              <div><Label>Дээд цалин (₮)</Label><Input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} /></div>
            </div>

            <div>
              <Label>Тайлбар</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>

            <div>
              <Label>Шаардлага (мөр бүрт нэг)</Label>
              <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} />
            </div>

            <div>
              <Label>Үүрэг хариуцлага (мөр бүрт нэг)</Label>
              <Textarea value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} />
            </div>

            <div>
              <Label>Давуу тал (мөр бүрт нэг)</Label>
              <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={3} />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handlePost}
              disabled={!form.title || (!form.companyId && !newCompany) || !form.categoryId || createJob.isPending}
            >
              {createJob.isPending ? "Нийтэлж байна..." : "Зар нийтлэх"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
