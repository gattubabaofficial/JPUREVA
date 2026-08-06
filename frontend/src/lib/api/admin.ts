import { apiFetch } from "./client";
import type { AdminAnalyticsOverview, AuditLogEntry, Paginated, PendingUser } from "./types";

export function listPendingApprovals() {
  return apiFetch<Paginated<PendingUser>>("/admin/approvals/");
}

export function approveUser(userId: number) {
  return apiFetch<PendingUser>(`/admin/approvals/${userId}/approve/`, { method: "POST" });
}

export function rejectUser(userId: number) {
  return apiFetch<PendingUser>(`/admin/approvals/${userId}/reject/`, { method: "POST" });
}

export function fetchAnalyticsOverview() {
  return apiFetch<AdminAnalyticsOverview>("/admin/analytics/overview/");
}

export function listUsers(params: { role?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && qs.set(k, v));
  const str = qs.toString();
  return apiFetch<Paginated<PendingUser>>(`/admin/users/${str ? `?${str}` : ""}`);
}

export function listAuditLog() {
  return apiFetch<Paginated<AuditLogEntry>>("/admin/audit-log/");
}
