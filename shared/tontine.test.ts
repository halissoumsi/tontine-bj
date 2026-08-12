import { describe, expect, it } from "vitest";
import {
  assertXofAmount,
  calculateRemainingAmount,
  calculateTotalCollected,
  isContributionComplete,
} from "./tontine";

describe("shared/tontine", () => {
  it("additionne des contributions XOF entières", () => {
    expect(calculateTotalCollected([8_500, 15_000, 25_000])).toBe(48_500);
  });

  it("calcule le reste dû sans retourner de valeur négative", () => {
    expect(calculateRemainingAmount(50_000, [20_000, 30_000])).toBe(0);
    expect(calculateRemainingAmount(50_000, [20_000])).toBe(30_000);
  });

  it("détecte une contribution complète", () => {
    expect(isContributionComplete(50_000, [25_000, 25_000])).toBe(true);
    expect(isContributionComplete(50_000, [25_000])).toBe(false);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejette un montant invalide: %s",
    (amount) => {
      expect(() => assertXofAmount(amount)).toThrow(RangeError);
    },
  );
});
