import Decimal, { DecimalSource } from "break_eternity.js";

type Softcap = (value: DecimalSource, start: DecimalSource) => Decimal;

interface SoftcapData {
  softcap: Softcap;
  start: DecimalSource;
}

export const SCG = {
  DIV(factor: DecimalSource): Softcap {
    return (value, start) =>
      Decimal.add(value, Decimal.sub(factor, 1).times(start)).div(factor);
  },

  ROOT(root: DecimalSource): Softcap {
    return (value, start) =>
      Decimal.mul(value, Decimal.pow(start, Decimal.sub(root, 1))).root(root);
  },

  EXP_ROOT(base: DecimalSource, root: DecimalSource): Softcap {
    return (value, start) =>
      Decimal.pow(
        base,
        Decimal.log(value, base)
          .times(Decimal.log(start, base).pow(Decimal.sub(root, 1)))
          .pow(Decimal.div(1, root))
      );
  },
};

export const SOFTCAPS = {
  HALF: SCG.DIV(2),
  THIRD: SCG.DIV(3),
  QUARTER: SCG.DIV(4),

  SQRT: SCG.ROOT(2),
  CBRT: SCG.ROOT(3),

  EXP_SQRT: SCG.EXP_ROOT(2, 10),
  EXP_CBRT: SCG.EXP_ROOT(3, 10),
};

export function combineSC(sc1: Softcap, sc2: Softcap): Softcap {
  return (value, start) => sc2(sc1(value, start), start);
}

export function createSoftcap(data: SoftcapData) {
  return {
    apply: (value: Decimal) => softcapped(data, value),
    display: (value: Decimal) => displaySoftcap(value, data.start),
  };
}

function softcapped(data: SoftcapData, value: Decimal) {
  if (Decimal.lt(value, data.start)) return value;
  return data.softcap(value, data.start);
}

function displaySoftcap(value: Decimal, start: DecimalSource) {
  if (Decimal.lt(value, start)) return "";
  else return "(softcapped)";
}
