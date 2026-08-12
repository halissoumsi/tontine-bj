/** Règles métier pures et sans effets de bord pour les montants de tontine. */

export const MAX_XOF_AMOUNT = 10_000_000;

export function assertXofAmount(amount: number): number {
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > MAX_XOF_AMOUNT) {
    throw new RangeError("Le montant XOF doit être un entier positif dans la limite autorisée.");
  }
  return amount;
}

export function calculateTotalCollected(contributions: readonly number[]): number {
  return contributions.reduce((total, amount) => total + assertXofAmount(amount), 0);
}

export function calculateRemainingAmount(target: number, contributions: readonly number[]): number {
  assertXofAmount(target);
  const remaining = target - calculateTotalCollected(contributions);
  return Math.max(remaining, 0);
}

export function isContributionComplete(target: number, contributions: readonly number[]): boolean {
  return calculateRemainingAmount(target, contributions) === 0;
}
