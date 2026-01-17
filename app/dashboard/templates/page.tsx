"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";

const stepInfo = [
  { step: 0, name: "Initial Outreach", timing: "Day 0", description: "Personalized opener + COC pain point" },
  { step: 1, name: "Follow-up", timing: "Day 4", description: "Workflow shift pitch + demo video" },
  { step: 2, name: "Value Prop", timing: "Day 9", description: "Time savings calculation (tier-specific)" },
  { step: 3, name: "Social Proof", timing: "Day 15", description: "Similar builder case study" },
  { step: 4, name: "Final Touch", timing: "Day 22", description: "Soft close, door open" },
];

const variableHints = [
  "{{contactName}}", "{{companyName}}", "{{personalizedOpener}}",
  "{{estimatedSubbies}}", "{{state}}", "{{calendlyUrl}}",
  "{{senderName}}", "{{senderTitle}}", "{{senderPhone}}", "{{demoVideoUrl}}"
];

function TemplateEditor({
  step,
  template,
  onSave,
  isSaving
}: {
  step: typeof stepInfo[0];
  template: {
    subjectA: string;
    subjectB: string;
    body: string;
    bodyVelocity?: string;
    bodyCompliance?: string;
    bodyBusiness?: string;
    delayDays: number;
    isActive: boolean;
  };
  onSave: (data: Record<string, unknown>) => void;
  isSaving: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editData, setEditData] = useState(template);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<"default" | "velocity" | "compliance" | "business">("default");

  useEffect(() => {
    setEditData(template);
    setHasChanges(false);
  }, [template]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave({ step: step.step, ...editData });
    setHasChanges(false);
  };

  const handleReset = () => {
    setEditData(template);
    setHasChanges(false);
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary-muted)] flex items-center justify-center">
            <span className="font-mono font-semibold text-[var(--accent-primary)]">{step.step}</span>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-[var(--text-primary)]">{step.name}</h3>
            <p className="text-xs text-[var(--text-tertiary)]">Day {editData.delayDays} • {step.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs bg-[var(--warning-muted)] text-[var(--warning)] px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${editData.isActive ? "bg-[var(--success-muted)] text-[var(--success)]" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"}`}>
            {editData.isActive ? "Active" : "Inactive"}
          </span>
          <svg
            className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-[var(--border-subtle)]">
          {/* Subject Lines */}
          <div className="pt-6">
            <h4 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Subject Lines (A/B Test)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[var(--text-tertiary)] mb-1.5">Variant A</label>
                <input
                  type="text"
                  value={editData.subjectA}
                  onChange={(e) => handleChange("subjectA", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-tertiary)] mb-1.5">Variant B</label>
                <input
                  type="text"
                  value={editData.subjectB}
                  onChange={(e) => handleChange("subjectB", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-4">Email Body</h4>

            {/* Tabs for Step 2 (tier-specific bodies) */}
            {step.step === 2 && (
              <div className="flex gap-2 mb-4">
                {(["default", "velocity", "compliance", "business"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === tab
                        ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {tab === "default" ? "Default" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={
                step.step === 2
                  ? activeTab === "velocity"
                    ? editData.bodyVelocity || ""
                    : activeTab === "compliance"
                    ? editData.bodyCompliance || ""
                    : activeTab === "business"
                    ? editData.bodyBusiness || ""
                    : editData.body
                  : editData.body
              }
              onChange={(e) => {
                if (step.step === 2) {
                  if (activeTab === "velocity") handleChange("bodyVelocity", e.target.value);
                  else if (activeTab === "compliance") handleChange("bodyCompliance", e.target.value);
                  else if (activeTab === "business") handleChange("bodyBusiness", e.target.value);
                  else handleChange("body", e.target.value);
                } else {
                  handleChange("body", e.target.value);
                }
              }}
              rows={12}
              className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-mono resize-none"
            />

            {/* Variable hints */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-[var(--text-tertiary)]">Variables:</span>
              {variableHints.map((v) => (
                <code key={v} className="text-xs bg-[var(--bg-tertiary)] text-[var(--accent-primary)] px-1.5 py-0.5 rounded">
                  {v}
                </code>
              ))}
            </div>
          </div>

          {/* Settings Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm text-[var(--text-secondary)]">Delay (days):</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={editData.delayDays}
                  onChange={(e) => handleChange("delayDays", parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-mono"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-subtle)] bg-[var(--bg-tertiary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">Active</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Discard
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  hasChanges && !isSaving
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary-hover)]"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplatesPage() {
  const templatesData = useQuery(api.templates.getAll);
  const initializeTemplates = useMutation(api.templates.initialize);
  const updateTemplate = useMutation(api.templates.update);
  const resetTemplates = useMutation(api.templates.reset);

  const [savingStep, setSavingStep] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInitialize = async () => {
    try {
      await initializeTemplates();
      showNotification("success", "Templates initialized successfully");
    } catch {
      showNotification("error", "Failed to initialize templates");
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    const step = data.step as number;
    setSavingStep(step);
    try {
      await updateTemplate({
        step,
        subjectA: data.subjectA as string,
        subjectB: data.subjectB as string,
        body: data.body as string,
        bodyVelocity: data.bodyVelocity as string | undefined,
        bodyCompliance: data.bodyCompliance as string | undefined,
        bodyBusiness: data.bodyBusiness as string | undefined,
        delayDays: data.delayDays as number,
        isActive: data.isActive as boolean,
      });
      showNotification("success", `Step ${step} template saved`);
    } catch {
      showNotification("error", "Failed to save template");
    } finally {
      setSavingStep(null);
    }
  };

  const handleResetAll = async () => {
    if (confirm("Reset all templates to defaults? This cannot be undone.")) {
      try {
        await resetTemplates({});
        showNotification("success", "All templates reset to defaults");
      } catch {
        showNotification("error", "Failed to reset templates");
      }
    }
  };

  const getTemplateForStep = (step: number) => {
    if (!templatesData?.templates) {
      return {
        subjectA: "",
        subjectB: "",
        body: "",
        delayDays: 0,
        isActive: true,
      };
    }

    const t = templatesData.templates;
    const stepKey = `step${step}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subjects = t.subjects as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodies = t.bodies as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timing = t.timing as any;

    return {
      subjectA: subjects[stepKey]?.A || "",
      subjectB: subjects[stepKey]?.B || "",
      body: bodies[stepKey] || "",
      bodyVelocity: step === 2 ? bodies.step2_velocity : undefined,
      bodyCompliance: step === 2 ? bodies.step2_compliance : undefined,
      bodyBusiness: step === 2 ? bodies.step2_business : undefined,
      delayDays: timing[stepKey] || 0,
      isActive: true,
    };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in ${
            notification.type === "success"
              ? "bg-[var(--success)] text-white"
              : "bg-[var(--error)] text-white"
          }`}
        >
          {notification.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/campaigns"
            className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Email Templates</h1>
            <p className="text-[var(--text-secondary)] mt-1">Edit your email sequence templates and A/B variants</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!templatesData?.initialized && (
            <button
              onClick={handleInitialize}
              className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--bg-primary)] rounded-lg text-sm font-medium hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              Initialize Templates
            </button>
          )}
          <button
            onClick={handleResetAll}
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-subtle)]"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[var(--info-muted)] border border-[var(--info)]/30 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-[var(--info)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div className="text-sm text-[var(--info)]">
          <strong>Template Variables:</strong> Use {`{{variableName}}`} syntax. Each lead will have these replaced with their actual data when emails are sent. Step 2 has tier-specific body templates for Velocity, Compliance, and Business leads.
        </div>
      </div>

      {/* Template Editors */}
      <div className="space-y-4">
        {stepInfo.map((step) => (
          <TemplateEditor
            key={step.step}
            step={step}
            template={getTemplateForStep(step.step)}
            onSave={handleSave}
            isSaving={savingStep === step.step}
          />
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Sequence Timeline</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stepInfo.map((step, index) => {
            const template = getTemplateForStep(step.step);
            return (
              <div key={step.step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${template.isActive ? "bg-[var(--accent-primary-muted)]" : "bg-[var(--bg-tertiary)]"}`}>
                    <span className={`font-mono font-semibold ${template.isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}>
                      {step.step}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] mt-2 whitespace-nowrap">Day {template.delayDays}</span>
                </div>
                {index < stepInfo.length - 1 && (
                  <div className="w-16 h-0.5 bg-[var(--border-subtle)] mx-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
