import {
  getVelocityTemplate,
  getVelocitySubject,
  velocitySequence,
} from "./velocity";
import {
  getComplianceTemplate,
  getComplianceSubject,
  complianceSequence,
} from "./compliance";
import {
  getBusinessTemplate,
  getBusinessSubject,
  getBusinessTextTemplate,
  businessSequence,
} from "./business";

export interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

export type Tier = "velocity" | "compliance" | "business";
export type Variant = "A" | "B";

export function getTemplate(
  tier: Tier,
  step: number,
  variant: Variant,
  params: TemplateParams
): string {
  switch (tier) {
    case "velocity":
      return getVelocityTemplate(step, variant, params);
    case "compliance":
      return getComplianceTemplate(step, variant, params);
    case "business":
      return getBusinessTemplate(step, variant, params);
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getSubject(
  tier: Tier,
  step: number,
  variant: Variant,
  companyName: string
): string {
  switch (tier) {
    case "velocity":
      return getVelocitySubject(step, variant, companyName);
    case "compliance":
      return getComplianceSubject(step, variant, companyName);
    case "business":
      return getBusinessSubject(step, variant, companyName);
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getSequence(tier: Tier) {
  switch (tier) {
    case "velocity":
      return velocitySequence;
    case "compliance":
      return complianceSequence;
    case "business":
      return businessSequence;
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getMaxSteps(tier: Tier): number {
  return getSequence(tier).length;
}

export function getDelayDays(tier: Tier, step: number): number {
  const sequence = getSequence(tier);
  const config = sequence[step];
  if (!config) return 7; // Default fallback
  return config.delayDays;
}

// Get plain text template for Step 0 (better deliverability - lands in Primary inbox)
export function getTextTemplate(
  tier: Tier,
  step: number,
  variant: Variant,
  params: TemplateParams
): string | null {
  // Only business tier has text templates for now
  // Only Step 0 uses plain text (first touch)
  if (tier === "business" && step === 0) {
    return getBusinessTextTemplate(step, variant, params);
  }
  return null;
}
