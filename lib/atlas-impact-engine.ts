export type ImpactEvidenceStatus = "verified" | "supported" | "estimated" | "estimate" | "reported" | "unknown";
export type ContributionLike = { quantity: number; verification: ImpactEvidenceStatus };
const evidenceWeight: Record<ImpactEvidenceStatus, number> = { verified: 1, supported: 0.75, estimated: 0.5, estimate: 0.5, reported: 0.25, unknown: 0 };

export function computeRiuBalance(records: ContributionLike[]) { return records.reduce((total, record) => total + Math.max(0, record.quantity) * evidenceWeight[record.verification], 0); }
export function riuLabel(records: ContributionLike[]) { const balance = computeRiuBalance(records); return { balance, label: `${balance.toFixed(2)} RIU`, method: "Reference contribution units weight user-reported and evidenced activity; they are not money, a carbon credit, or a verified impact claim." }; }
