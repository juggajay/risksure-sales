"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function MetricCard({
  label,
  value,
  subValue,
  trend,
  icon,
  accentColor = "var(--accent-primary)",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 15%, transparent)` }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.isPositive
                ? "bg-[var(--success-muted)] text-[var(--success)]"
                : "bg-[var(--error-muted)] text-[var(--error)]"
            }`}
          >
            <svg
              className={`w-3 h-3 ${trend.isPositive ? "" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-semibold text-[var(--text-primary)] font-mono tracking-tight">{value}</div>
        <div className="text-sm text-[var(--text-tertiary)]">{label}</div>
        {subValue && <div className="text-xs text-[var(--text-muted)] mt-2">{subValue}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "var(--info-muted)", text: "var(--info)", label: "New" },
    validating: { bg: "var(--warning-muted)", text: "var(--warning)", label: "Validating" },
    enriching: { bg: "var(--warning-muted)", text: "var(--warning)", label: "Enriching" },
    ready: { bg: "var(--success-muted)", text: "var(--success)", label: "Ready" },
    contacted: { bg: "var(--accent-primary-muted)", text: "var(--accent-primary)", label: "Contacted" },
    opened: { bg: "var(--success-muted)", text: "var(--success)", label: "Opened" },
    replied: { bg: "var(--success-muted)", text: "var(--success)", label: "Replied" },
    demo_scheduled: { bg: "var(--success-muted)", text: "var(--success)", label: "Demo Scheduled" },
    bounced: { bg: "var(--error-muted)", text: "var(--error)", label: "Bounced" },
    unsubscribed: { bg: "var(--error-muted)", text: "var(--error)", label: "Unsubscribed" },
  };

  const config = statusConfig[status] || { bg: "var(--bg-hover)", text: "var(--text-tertiary)", label: status };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const tierConfig: Record<string, { bg: string; text: string }> = {
    velocity: { bg: "var(--info-muted)", text: "var(--info)" },
    compliance: { bg: "var(--warning-muted)", text: "var(--warning)" },
    business: { bg: "var(--accent-primary-muted)", text: "var(--accent-primary)" },
  };

  const config = tierConfig[tier] || { bg: "var(--bg-hover)", text: "var(--text-tertiary)" };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {tier}
    </span>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.leads.getStats);
  const recentLeads = useQuery(api.leads.getAll);

  const totalLeads = stats?.total || 0;
  const demosScheduled = stats?.byStatus?.demo_scheduled || 0;

  // Count all leads that have ever been sent an email (contacted + all downstream statuses)
  const everContacted =
    (stats?.byStatus?.contacted || 0) +
    (stats?.byStatus?.opened || 0) +
    (stats?.byStatus?.clicked || 0) +
    (stats?.byStatus?.replied || 0) +
    (stats?.byStatus?.demo_scheduled || 0) +
    (stats?.byStatus?.nurture || 0) +
    (stats?.byStatus?.closed_won || 0) +
    (stats?.byStatus?.closed_lost || 0) +
    (stats?.byStatus?.unsubscribed || 0) +
    (stats?.byStatus?.bounced || 0);

  // Count all leads that have opened at least once (opened + all downstream statuses)
  const everOpened =
    (stats?.byStatus?.opened || 0) +
    (stats?.byStatus?.clicked || 0) +
    (stats?.byStatus?.replied || 0) +
    (stats?.byStatus?.demo_scheduled || 0);

  const openRate = everContacted > 0 ? Math.round((everOpened / everContacted) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor your sales automation pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)]">
            Export Data
          </button>
          <button className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors shadow-lg shadow-[var(--accent-primary)]/20">
            Run Pipeline
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Leads"
          value={totalLeads}
          subValue="Across all tiers"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          accentColor="var(--info)"
        />
        <MetricCard
          label="Emails Sent"
          value={everContacted}
          subValue="Step 0 outreach"
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
          accentColor="var(--accent-primary)"
        />
        <MetricCard
          label="Open Rate"
          value={`${openRate}%`}
          subValue={`${everOpened} opened`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          accentColor="var(--success)"
        />
        <MetricCard
          label="Demos Booked"
          value={demosScheduled}
          subValue="This month"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
          accentColor="var(--warning)"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Leads</h2>
            <a href="/dashboard/leads" className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-tertiary)]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Tier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {recentLeads?.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[var(--text-primary)]">{lead.companyName}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">{lead.state || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[var(--text-secondary)]">{lead.contactName}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">{lead.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <TierBadge tier={lead.tier} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm text-[var(--text-secondary)]">
                        {lead.enrichmentScore || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!recentLeads || recentLeads.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                      No leads yet. Import some to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="font-semibold text-[var(--text-primary)]">Pipeline Status</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "New", count: stats?.byStatus?.new || 0, color: "var(--info)" },
              { label: "Enriching", count: stats?.byStatus?.enriching || 0, color: "var(--warning)" },
              { label: "Ready", count: stats?.byStatus?.ready || 0, color: "var(--success)" },
              { label: "Contacted", count: stats?.byStatus?.contacted || 0, color: "var(--accent-primary)" },
              { label: "Opened", count: stats?.byStatus?.opened || 0, color: "var(--success)" },
              { label: "Replied", count: stats?.byStatus?.replied || 0, color: "var(--success)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                </div>
                <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">By Tier</span>
            </div>
            <div className="space-y-3 mt-3">
              {[
                { label: "Velocity", count: stats?.byTier?.velocity || 0, color: "var(--info)" },
                { label: "Compliance", count: stats?.byTier?.compliance || 0, color: "var(--warning)" },
                { label: "Business", count: stats?.byTier?.business || 0, color: "var(--accent-primary)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
