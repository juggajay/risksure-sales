"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

function WarmingGauge({ current, target }: { current: number; target: number }) {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--bg-hover)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">{current}</span>
        <span className="text-xs text-[var(--text-tertiary)]">/ {target}</span>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const warmingConfig = useQuery(api.warming.getStatus);
  const stats = useQuery(api.leads.getStats);

  const runPipeline = async () => {
    setIsRunning(true);
    setLastResult(null);

    try {
      const response = await fetch("/api/cron/daily-pipeline", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setLastResult({
          success: true,
          message: `Pipeline completed: ${data.emailsSent || 0} emails sent`,
        });
      } else {
        setLastResult({
          success: false,
          message: data.error || "Pipeline failed",
        });
      }
    } catch {
      setLastResult({
        success: false,
        message: "Failed to run pipeline",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const readyLeads = stats?.byStatus?.ready || 0;
  const currentLimit = warmingConfig?.currentDailyLimit || 20;
  const targetLimit = warmingConfig?.targetDailyLimit || 200;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Pipeline</h1>
          <p className="text-[var(--text-secondary)] mt-1">Run and monitor your sales automation pipeline</p>
        </div>
        <button
          onClick={runPipeline}
          disabled={isRunning}
          className={`
            px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300
            ${isRunning
              ? "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed"
              : "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary-hover)] shadow-lg shadow-[var(--accent-primary)]/20"
            }
          `}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running Pipeline...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Run Pipeline
            </span>
          )}
        </button>
      </div>

      {/* Result Banner */}
      {lastResult && (
        <div
          className={`
            p-4 rounded-xl border flex items-center gap-3 animate-fade-in
            ${lastResult.success
              ? "bg-[var(--success-muted)] border-[var(--success)]/30"
              : "bg-[var(--error-muted)] border-[var(--error)]/30"
            }
          `}
        >
          {lastResult.success ? (
            <svg className="w-5 h-5 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[var(--error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <span className={lastResult.success ? "text-[var(--success)]" : "text-[var(--error)]"}>
            {lastResult.message}
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Domain Warming */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Domain Warming</h3>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Daily email limit</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse-subtle"></span>
          </div>
          <div className="flex items-center justify-center">
            <WarmingGauge current={currentLimit} target={targetLimit} />
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-tertiary)]">Progress</span>
              <span className="font-mono text-[var(--text-secondary)]">{Math.round((currentLimit / targetLimit) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Queue Status */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-[var(--text-primary)]">Queue Status</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Leads ready for outreach</p>
          </div>
          <div className="text-center py-4">
            <div className="text-5xl font-bold font-mono text-[var(--accent-primary)]">{readyLeads}</div>
            <div className="text-sm text-[var(--text-tertiary)] mt-2">ready to send</div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-tertiary)]">Today&apos;s limit</span>
              <span className="font-mono text-[var(--text-secondary)]">{currentLimit}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-tertiary)]">Can send</span>
              <span className="font-mono text-[var(--success)]">{Math.min(readyLeads, currentLimit)}</span>
            </div>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-[var(--text-primary)]">Pipeline Stats</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">Current status breakdown</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "New", count: stats?.byStatus?.new || 0, color: "var(--info)" },
              { label: "Enriching", count: stats?.byStatus?.enriching || 0, color: "var(--warning)" },
              { label: "Ready", count: stats?.byStatus?.ready || 0, color: "var(--success)" },
              { label: "Contacted", count: stats?.byStatus?.contacted || 0, color: "var(--accent-primary)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                </div>
                <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Configuration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Email Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">Sender Domain</span>
                  <span className="font-mono text-sm text-[var(--text-primary)]">risksure.ai</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">From Name</span>
                  <span className="font-mono text-sm text-[var(--text-primary)]">Jackson</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">Reply-To</span>
                  <span className="font-mono text-sm text-[var(--text-primary)]">jackson@risksure.ai</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Pipeline Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">A/B Test Split</span>
                  <span className="font-mono text-sm text-[var(--text-primary)]">50/50</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">Sequence Steps</span>
                  <span className="font-mono text-sm text-[var(--text-primary)]">5</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--text-secondary)]">Auto-run Schedule</span>
                  <span className="font-mono text-sm text-[var(--text-muted)]">Disabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
