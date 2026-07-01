"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "./store";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  location?: string;
  description?: string;
  size?: string;
  _count?: { jobs: number };
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  _count?: { jobs: number };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  country?: string;
  location: string;
  type: string;
  mode: string;
  experience?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  views: number;
  company: Company;
  category: Category;
  companyId: string;
  categoryId: string;
  _count?: { applications: number };
  createdAt: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  expectedSalary?: number;
  coverLetter?: string;
  status: string;
  job: Job;
  createdAt: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  job: Job;
  createdAt: string;
}

export function useJobs() {
  const { searchQuery, locationQuery, filters, country } = useAppStore();
  const params = new URLSearchParams();
  params.set("country", country);
  if (searchQuery) params.set("search", searchQuery);
  if (locationQuery) params.set("location", locationQuery);
  if (filters.category) params.set("category", filters.category);
  if (filters.type) params.set("type", filters.type);
  if (filters.mode) params.set("mode", filters.mode);
  if (filters.experience) params.set("experience", filters.experience);
  if (filters.salaryMin) params.set("salaryMin", filters.salaryMin);
  if (filters.salaryMax) params.set("salaryMax", filters.salaryMax);

  return useQuery<Job[]>({
    queryKey: ["jobs", params.toString()],
    queryFn: () => fetcher(`/api/jobs?${params}`),
  });
}

export function useJob(id: string | null) {
  return useQuery<Job>({
    queryKey: ["job", id],
    queryFn: () => fetcher(`/api/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCategories() {
  const country = useAppStore((s) => s.country);
  return useQuery<Category[]>({ queryKey: ["categories", country], queryFn: () => fetcher(`/api/categories?country=${country}`) });
}

export function useCompanies() {
  const country = useAppStore((s) => s.country);
  return useQuery<Company[]>({ queryKey: ["companies", country], queryFn: () => fetcher(`/api/companies?country=${country}`) });
}

export function useStats() {
  const country = useAppStore((s) => s.country);
  return useQuery<{ jobs: number; companies: number; categories: number }>({
    queryKey: ["stats", country],
    queryFn: () => fetcher(`/api/stats?country=${country}`),
  });
}

export function useSavedJobs() {
  const sessionId = useAppStore((s) => s.sessionId);
  return useQuery<SavedJob[]>({
    queryKey: ["saved-jobs", sessionId],
    queryFn: () => fetcher(`/api/saved-jobs?sessionId=${sessionId}`),
    enabled: sessionId !== "server",
  });
}

export function useApplications() {
  const email = useAppStore((s) => s.userEmail);
  return useQuery<Application[]>({
    queryKey: ["applications", email],
    queryFn: () => fetcher(`/api/applications?email=${email}`),
    enabled: !!email,
  });
}

export function useApplyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, data }: { jobId: string; data: Record<string, unknown> }) => {
      const res = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Apply failed");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["applications"] }); },
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  const sessionId = useAppStore((s) => s.sessionId);
  return useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch("/api/saved-jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, jobId }) });
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["saved-jobs"] }); },
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["jobs"] }); qc.invalidateQueries({ queryKey: ["stats"] }); },
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/companies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["companies"] }); },
  });
}
