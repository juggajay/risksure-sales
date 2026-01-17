"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "var(--info-muted)", text: "var(--info)", label: "New" },
    validating: { bg: "var(--warning-muted)", text: "var(--warning)", label: "Validating" },
    enriching: { bg: "var(--warning-muted)", text: "var(--warning)", label: "Enriching" },
    ready: { bg: "var(--success-muted)", text: "var(--success)", label: "Ready" },
    contacted: { bg: "var(--accent-primary-muted)", text: "var(--accent-primary)", label: "Contacted" },
    opened: { bg: "var(--success-muted)", text: "var(--success)", label: "Opened" },
    clicked: { bg: "var(--success-muted)", text: "var(--success)", label: "Clicked" },
    replied: { bg: "var(--success-muted)", text: "var(--success)", label: "Replied" },
    demo_scheduled: { bg: "var(--success-muted)", text: "var(--success)", label: "Demo Scheduled" },
    bounced: { bg: "var(--error-muted)", text: "var(--error)", label: "Bounced" },
    unsubscribed: { bg: "var(--error-muted)", text: "var(--error)", label: "Unsubscribed" },
    invalid_email: { bg: "var(--error-muted)", text: "var(--error)", label: "Invalid Email" },
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

function VariantBadge({ variant }: { variant?: "A" | "B" }) {
  if (!variant) return <span className="text-[var(--text-muted)]">—</span>;

  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[var(--bg-hover)] text-xs font-mono font-medium text-[var(--text-secondary)]">
      {variant}
    </span>
  );
}

export default function LeadsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const allLeads = useQuery(api.leads.getAll);

  // Filter leads
  const filteredLeads = allLeads?.filter((lead) => {
    if (filter !== "all" && lead.status !== filter) return false;
    if (tierFilter !== "all" && lead.tier !== tierFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        lead.companyName.toLowerCase().includes(searchLower) ||
        lead.contactName.toLowerCase().includes(searchLower) ||
        lead.contactEmail.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "enriching", label: "Enriching" },
    { value: "ready", label: "Ready" },
    { value: "contacted", label: "Contacted" },
    { value: "opened", label: "Opened" },
    { value: "replied", label: "Replied" },
    { value: "demo_scheduled", label: "Demo Scheduled" },
    { value: "bounced", label: "Bounced" },
  ];

  const tierOptions = [
    { value: "all", label: "All Tiers" },
    { value: "velocity", label: "Velocity" },
    { value: "compliance", label: "Compliance" },
    { value: "business", label: "Business" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Leads</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {filteredLeads?.length || 0} leads {filter !== "all" || tierFilter !== "all" ? "(filtered)" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)]">
            Import CSV
          </button>
          <button className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors shadow-lg shadow-[var(--accent-primary)]/20">
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-muted)]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:border-[var(--accent-primary)]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-secondary)] focus:border-[var(--accent-primary)]"
        >
          {tierOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-tertiary)]">
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Tier</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Variant</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Step</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Subbies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLeads?.map((lead, index) => (
                <tr
                  key={lead._id}
                  className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--text-primary)]">{lead.companyName}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{lead.state || "—"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[var(--text-secondary)]">{lead.contactName}</div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate max-w-[200px]">{lead.contactEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <TierBadge tier={lead.tier} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <VariantBadge variant={lead.sequenceVariant} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-sm text-[var(--text-secondary)]">{lead.currentSequenceStep}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {lead.enrichmentScore ? (
                      <span
                        className={`font-mono text-sm font-medium ${
                          lead.enrichmentScore >= 80
                            ? "text-[var(--success)]"
                            : lead.enrichmentScore >= 60
                            ? "text-[var(--warning)]"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {lead.enrichmentScore}
                      </span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm text-[var(--text-secondary)]">
                      {lead.estimatedSubbies || "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {(!filteredLeads || filteredLeads.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="text-[var(--text-tertiary)]">
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg font-medium">No leads found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or import new leads</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
