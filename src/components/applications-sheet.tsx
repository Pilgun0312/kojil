"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { APPLICATION_STATUS, formatSalary, timeAgo } from "@/lib/constants";
import { FileText, Building2 } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  REVIEWED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ACCEPTED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function ApplicationsSheet({ open, onClose }: Props) {
  const { userEmail, setUserEmail } = useAppStore();
  const { data: applications } = useApplications();
  const [email, setEmail] = useState(userEmail);

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" /> Миний горилолтууд
          </SheetTitle>
          <SheetDescription>Илгээсэн горилолтуудын төлөв</SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          {!userEmail ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">И-мэйл хаягаа оруулна уу:</p>
              <div className="flex gap-2">
                <Input placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setUserEmail(email)}>Хайх</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{userEmail} • {applications?.length || 0} горилолт</p>
              {applications?.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Горилолт байхгүй</p>}
              {applications?.map((app) => (
                <div key={app.id} className="rounded-lg border p-3">
                  <h4 className="font-medium text-sm">{app.job.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3" /> {app.job.company.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className={statusColors[app.status] || ""}>
                      {APPLICATION_STATUS[app.status] || app.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(app.createdAt)}</span>
                  </div>
                  {app.expectedSalary && (
                    <p className="text-xs text-muted-foreground mt-1">Хүсэх цалин: {formatSalary(app.expectedSalary, null)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
