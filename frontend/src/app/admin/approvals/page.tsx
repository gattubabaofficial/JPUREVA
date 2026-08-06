"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { approveUser, listPendingApprovals, rejectUser } from "@/lib/api/admin";
import type { PendingUser } from "@/lib/api/types";

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [acting, setActing] = useState<number | null>(null);

  function load() {
    listPendingApprovals().then((res) => setPending(res.results));
  }

  useEffect(load, []);

  async function handle(action: "approve" | "reject", userId: number) {
    setActing(userId);
    try {
      if (action === "approve") await approveUser(userId);
      else await rejectUser(userId);
      load();
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl text-foreground">Pending approvals</h1>

      {pending.length === 0 ? (
        <p className="text-sm text-foreground/50">No pending supplier or lab applications.</p>
      ) : (
        <div className="space-y-3">
          {pending.map((u) => (
            <Card key={u.id}>
              <CardBody className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.email}</div>
                  <div className="text-xs text-foreground/50">{u.role} · Applied {new Date(u.date_joined).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" loading={acting === u.id} onClick={() => handle("reject", u.id)}>Reject</Button>
                  <Button size="sm" loading={acting === u.id} onClick={() => handle("approve", u.id)}>Approve</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
