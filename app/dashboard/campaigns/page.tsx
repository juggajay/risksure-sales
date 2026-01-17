"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const sequenceSteps = [
  { step: 0, name: "Initial Outreach", timing: "Day 0", description: "Personalized opener + COC pain point" },
  { step: 1, name: "Follow-up", timing: "Day 4", description: "Workflow shift pitch + demo video" },
  { step: 2, name: "Value Prop", timing: "Day 9", description: "Time savings calculation (tier-specific)" },
  { step: 3, name: "Social Proof", timing: "Day 15", description: "Similar builder case study" },
  { step: 4, name: "Final Touch", timing: "Day 22", description: "Soft close, door open" },
];

function SequenceCard({ step, stats }: { step: typeof sequenceSteps[0]; stats: { sent: number; opened: number; replied: number } }) {
  const openRate = stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0;
  const replyRate = stats.sent > 0 ? Math.round((stats.replied / stats.sent) * 100) : 0;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] p-6 hover:border-[var(--border-default)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-muted)] flex items-center justify-center">
            <span className="font-mono font-semibold text-[var(--accent-primary)]">{step.step}</span>
          </div>
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">{step.name}</h3>
            <p className="text-xs text-[var(--text-tertiary)]">{step.timing}</p>
          </div>
        </div>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
          {step.description}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
        <div>
          <div className="text-2xl font-semibold font-mono text-[var(--text-primary)]">{stats.sent}</div>
          <div className="text-xs text-[var(--text-tertiary)]">Sent</div>
        </div>
        <div>
          <div className="text-2xl font-semibold font-mono text-[var(--success)]">{openRate}%</div>
          <div className="text-xs text-[var(--text-tertiary)]">Open Rate</div>
        </div>
        <div>
          <div className="text-2xl font-semibold font-mono text-[var(--accent-primary)]">{replyRate}%</div>
          <div className="text-xs text-[var(--text-tertiary)]">Reply Rate</div>
        </div>
      </div>
    </div>
  );
}

function ABTestCard({ testName, variantA, variantB, winner }: {
  testName: string;
  variantA: { subject: string; sent: number; opened: number };
  variantB: { subject: string; sent: number; opened: number };
  winner?: "A" | "B" | "none";
}) {
  const openRateA = variantA.sent > 0 ? Math.round((variantA.opened / variantA.sent) * 100) : 0;
  const openRateB = variantB.sent > 0 ? Math.round((variantB.opened / variantB.sent) * 100) : 0;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <h3 className="font-medium text-[var(--text-primary)]">{testName}</h3>
        {winner && winner !== "none" && (
          <span className="text-xs font-medium bg-[var(--success-muted)] text-[var(--success)] px-2 py-1 rounded-full">
            Winner: Variant {winner}
          </span>
        )}
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {/* Variant A */}
        <div className={`p-6 ${winner === "A" ? "bg-[var(--success-muted)]/30" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center font-mono font-semibold text-[var(--text-secondary)]">A</span>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] truncate">{variantA.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">{variantA.sent}</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-1">sent</span>
            </div>
            <div>
              <span className="font-mono text-lg font-semibold text-[var(--success)]">{openRateA}%</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-1">opened</span>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--success)] rounded-full transition-all" style={{ width: `${openRateA}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Variant B */}
        <div className={`p-6 ${winner === "B" ? "bg-[var(--success-muted)]/30" : ""}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center font-mono font-semibold text-[var(--text-secondary)]">B</span>
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)] truncate">{variantB.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="font-mono text-lg font-semibold text-[var(--text-primary)]">{variantB.sent}</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-1">sent</span>
            </div>
            <div>
              <span className="font-mono text-lg font-semibold text-[var(--success)]">{openRateB}%</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-1">opened</span>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--success)] rounded-full transition-all" style={{ width: `${openRateB}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const stats = useQuery(api.leads.getStats);

  // Mock stats for sequence steps based on real lead status counts
  const getStepStats = (step: number) => {
    const contacted = stats?.byStatus?.contacted || 0;
    const opened = stats?.byStatus?.opened || 0;
    const replied = stats?.byStatus?.replied || 0;

    // For now, most activity is in Step 0
    if (step === 0) {
      return { sent: contacted + opened + replied, opened: opened + replied, replied };
    }
    return { sent: 0, opened: 0, replied: 0 };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Campaigns</h1>
          <p className="text-[var(--text-secondary)] mt-1">Email sequence performance and A/B test results</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/templates"
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)]"
          >
            View Templates
          </Link>
        </div>
      </div>

      {/* Sequence Overview */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Email Sequence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sequenceSteps.map((step) => (
            <SequenceCard key={step.step} step={step} stats={getStepStats(step.step)} />
          ))}
        </div>
      </div>

      {/* A/B Tests */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">A/B Test Results</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ABTestCard
            testName="Step 0 - Initial Outreach"
            variantA={{
              subject: "Quick question about {{company}}'s COC process",
              sent: Math.round((stats?.byStatus?.contacted || 0) / 2),
              opened: Math.round((stats?.byStatus?.opened || 0) / 2),
            }}
            variantB={{
              subject: "{{name}} - how do you handle subbie certificates?",
              sent: Math.round((stats?.byStatus?.contacted || 0) / 2),
              opened: Math.round((stats?.byStatus?.opened || 0) / 2),
            }}
          />
          <ABTestCard
            testName="Step 1 - Follow-up"
            variantA={{
              subject: "Re: Quick question about {{company}}'s COC process",
              sent: 0,
              opened: 0,
            }}
            variantB={{
              subject: "The workflow shift",
              sent: 0,
              opened: 0,
            }}
          />
        </div>
      </div>

      {/* Performance by Tier */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Performance by Tier</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {[
              { tier: "Velocity", color: "var(--info)", leads: stats?.byTier?.velocity || 0, target: "20-75 subbies" },
              { tier: "Compliance", color: "var(--warning)", leads: stats?.byTier?.compliance || 0, target: "75-250 subbies" },
              { tier: "Business", color: "var(--accent-primary)", leads: stats?.byTier?.business || 0, target: "250+ subbies" },
            ].map((item) => (
              <div key={item.tier} className="text-center p-6 bg-[var(--bg-tertiary)] rounded-xl">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                >
                  <span className="text-2xl font-bold font-mono" style={{ color: item.color }}>{item.leads}</span>
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">{item.tier}</h3>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">{item.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
