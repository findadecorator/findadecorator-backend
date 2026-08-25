import { PRICING_RULES_V1, PricingRuleVersion } from "./rules";

const VERSION_MAP: Record<string, PricingRuleVersion> = {
  [PRICING_RULES_V1.version]: PRICING_RULES_V1
};

export function getActivePricingRuleVersion(): PricingRuleVersion {
  return PRICING_RULES_V1;
}

export function getPricingRuleVersion(version: string): PricingRuleVersion | null {
  return VERSION_MAP[version] ?? null;
}

export function listPricingRuleVersions(): PricingRuleVersion[] {
  return Object.values(VERSION_MAP);
}
