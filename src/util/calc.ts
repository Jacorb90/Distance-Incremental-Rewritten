import Decimal, { DecimalSource } from "break_eternity.js";
import { ComputedRef, Ref, computed, unref } from "vue";

export type MaybeRef<T> = T | Ref<T>;

export interface CostFormula {
  cost: ComputedRef<Decimal>;
  accCost: ComputedRef<Decimal>;
  target: ComputedRef<Decimal>;
}
export interface ValuePacket {
  amt: MaybeRef<DecimalSource>;
  res: MaybeRef<DecimalSource>;
}

function createCostFormula(
  cbf: (x: DecimalSource) => Decimal,
  inv: (x: DecimalSource) => Decimal,
  d: MaybeRef<DecimalSource>,
  vp: ValuePacket
): CostFormula {
  const cost = computed(() =>
    cbf(Decimal.add(unref(vp.amt), 1))
      .sub(cbf(unref(vp.amt)))
      .plus(unref(d))
  );
  const target = computed(() =>
    inv(
      Decimal.mul(unref(vp.res), Decimal.sub(1, unref(d)))
        .plus(cbf(unref(vp.amt)))
        .plus(unref(d))
    ).floor()
  );
  const endAmt = computed(() =>
    Decimal.sub(target.value, 1).max(unref(vp.amt))
  );
  const accCost = computed(() =>
    cbf(Decimal.add(unref(endAmt), 1))
      .sub(cbf(unref(vp.amt)))
      .plus(Decimal.sub(unref(endAmt), unref(vp.amt)).times(unref(d)))
  );

  return { cost, accCost, target };
}

export function createExponentialCBF(
  factor: MaybeRef<DecimalSource>,
  base: MaybeRef<DecimalSource>,
  vp: ValuePacket
): CostFormula {
  return createCostFormula(
    (x) =>
      Decimal.pow(unref(base), x)
        .times(unref(factor))
        .div(Decimal.sub(unref(base), 1)),
    (x) => {
      const n = Decimal.sub(unref(base), 1).times(x).div(unref(factor));
      if (n.lt(1)) return Decimal.dZero;
      return n.log(unref(base));
    },
    0,
    vp
  );
}

export function createPolyExponentialCBF(
  factor: MaybeRef<DecimalSource>,
  base: MaybeRef<DecimalSource>,
  exp: MaybeRef<DecimalSource>,
  vp: ValuePacket
): CostFormula {
  return createCostFormula(
    (x) =>
      Decimal.mul(
        Decimal.div(unref(factor), Decimal.sub(unref(base), 1)),
        Decimal.pow(unref(base), Decimal.pow(x, unref(exp)))
      ),
    (x) => {
      const n = Decimal.sub(unref(base), 1).times(x).div(unref(factor));
      if (n.lt(1)) return Decimal.dZero;
      return n.log(unref(base)).root(unref(exp));
    },
    0,
    vp
  );
}
