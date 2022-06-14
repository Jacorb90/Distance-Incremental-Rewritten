import Decimal, { DecimalSource } from "break_eternity.js";
import player from "@/main";

export const DISTANCES = {
  m: 1,
  km: 1e3,
  Mm: 1e6,
  Gm: 1e9,
  Tm: 1e12,
  Pm: 1e15,
  ly: 9.461e15,
  pc: 3.086e16,
  kpc: 3.086e19,
  Mpc: 3.086e22,
  Gpc: 3.086e25,
  uni: 4.4e26,
  mlt: "4.4e1000000026",
};

const LIMITED_DISTANCES = {
  m: 1,
  uni: 4.4e26,
  mlt: "4.4e1000000026",
};

const STANDARD_DATA = {
  STARTS: ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
  ONES: ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
  TENS: ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Ocg", "Nog"],
  HUNDREDS: ["", "C", "Duc", "Tc", "Qac", "Qic", "Sxc", "Spc", "Occ", "Noc"],
  MILESTONES: [
    "",
    "MI",
    "MC",
    "NA",
    "PC",
    "FM",
    "AT",
    "ZP",
    "YC",
    "XN",
    "VE",
    "ME",
    "DE",
    "TE",
    "TEE",
    "PE",
    "HE",
    "HPE",
    "OE",
    "EE",
    "IC",
  ],
  MILESTONE_TENS: [
    "",
    "CO",
    "VCO",
    "TECO",
    "PCO",
    "HXCO",
    "HPCO",
    "OCCO",
    "ENCO",
  ],
  MILESTONE_HUNDREDS: [
    "",
    "HC",
    "DUHC",
    "TUHC",
    "QAHC",
    "QIHC",
    "SXHC",
    "SPHC",
    "OCHC",
    "NOHC",
  ],
  SUPER_MS: ["KL", "MG", "GG", "TR", "PT", "EX", "ZT", "YT", "XEN", "VK"],
};

function dMod(a: DecimalSource, b: DecimalSource): Decimal {
  return Decimal.sub(a, Decimal.mul(b, Decimal.div(a, b).floor()));
}

function addZeroes(
  orig: number,
  num: number,
  digits: number,
  whole = false
): string {
  let result =
    orig == Math.round(orig)
      ? Math.round(num).toString()
      : num.toLocaleString("en", {
          useGrouping: false,
          minimumFractionDigits: Math.max(digits, 1),
        });
  if (whole && result.includes(".") && result[result.length - 1] == "0") {
    while (result[result.length - 1] == "0")
      result = result.substring(0, result.length - 1);
  }
  if (result[result.length - 1] == ".")
    result = result.substring(0, result.length - 1);
  return result;
}

function dPlaces(d: Decimal, places: number, whole = false, base = 10): string {
  return nPlaces(d.toNumber(), places, whole, base);
}

function nPlaces(
  num: number,
  places: number,
  whole = false,
  base = 10
): string {
  const len = places + 1;
  const digits = Math.ceil(Math.log10(Math.max(num, 1)));
  const rounded =
    Math.round(num * Math.pow(10, len - digits)) * Math.pow(10, digits - len);

  if (base == 10) {
    if (num < 0.001) {
      if (num <= 1e-100) return "0";
      const e = Math.floor(-1 * Math.log10(num));
      const m = num * Math.pow(10, e + 1);
      return (
        nPlaces(m, places, false, base) + "e-" + nPlaces(e, places, true, base)
      );
    } else if (num < Math.pow(10, places) || num < 1000) {
      const innerPlaces = Math.min(Math.max(len - digits, 0), places);
      return addZeroes(
        num,
        parseFloat(rounded.toFixed(innerPlaces)),
        innerPlaces,
        whole
      );
    } else {
      const e = Math.floor(Math.log10(num));
      const m = num / Math.pow(10, e);
      return nPlaces(m, places, whole, base) + "e" + e;
    }
  } else {
    if (num.toString(base).split(".")[0].length < places + 2) {
      return (
        (num * Math.pow(base, len - digits)) /
        Math.pow(base, len - digits)
      )
        .toString(base)
        .slice(0, places + 1)
        .toUpperCase();
    } else {
      const exponent = Math.floor(Math.log(Math.max(num, 1)) / Math.log(base));
      const expStr = exponent.toString(base).toUpperCase();
      const mantissaStr = (
        (Math.round(num / Math.pow(base, exponent)) * Math.pow(base, digits)) /
        Math.pow(base, digits)
      )
        .toString(base)
        .toUpperCase();
      return mantissaStr + "e" + expStr;
    }
  }
}

export function formatWhole(num: DecimalSource) {
  return format(num, 0);
}

export function format(
  num: DecimalSource,
  places = 4,
  notation = player.value.opts.notation
): string {
  const d = new Decimal(num);

  if (d.sign == -1) return "-" + format(d.times(-1), places, notation);

  switch (notation) {
    case 0: // Mixed Scientific (0)
      if (d.lt(0.001)) return format(d, places, 2);
      else if (d.lt(1e33)) return format(d, places, 1);
      else if (d.lt(Decimal.pow(10, Decimal.pow(10, places - 1))))
        return format(d, places, 2);
      else if (d.lt("ee33")) return "e" + format(d.log10(), places, 1);
      else return format(d, places, 2);

    case 1: // Standard (1)
      if (d.lt(0.001)) return "0";
      else if (d.lt(1e3)) return dPlaces(d, places);
      else {
        const mantissa = d.div(
          Decimal.pow(10, d.log10().div(3).floor().times(3))
        );

        if (d.lt(1e33))
          return (
            dPlaces(mantissa, places) +
            " " +
            STANDARD_DATA.STARTS[d.log10().sub(3).div(3).floor().toNumber()]
          );
        else if (d.lt(1e303))
          return (
            dPlaces(mantissa, places) +
            " " +
            STANDARD_DATA.ONES[
              dMod(d.log10().sub(3).div(3), 10).floor().toNumber()
            ] +
            STANDARD_DATA.TENS[d.log10().sub(3).div(30).floor().toNumber()]
          );
        else if (d.lt("1e3003"))
          return (
            dPlaces(mantissa, places) +
            " " +
            STANDARD_DATA.ONES[
              dMod(d.log10().sub(3).div(3), 10).floor().toNumber()
            ] +
            STANDARD_DATA.TENS[
              dMod(d.log10().sub(3).div(30), 10).floor().toNumber()
            ] +
            STANDARD_DATA.HUNDREDS[d.log10().sub(3).div(300).floor().toNumber()]
          );
        else if (
          d.lt(Decimal.pow(10, Decimal.pow(10, 63).times(3)).times(1e3))
        ) {
          const highest = d
            .log10()
            .sub(3)
            .div(3)
            .log10()
            .div(3)
            .floor()
            .toNumber();
          const size = Math.min(highest, 2);

          let txt = dPlaces(mantissa, places) + " ";

          for (let x = highest; x > Math.max(highest - size, 0); x--) {
            const m = Decimal.pow(1000, x);
            txt +=
              STANDARD_DATA.ONES[
                dMod(d.log10().sub(3).div(m.times(3)), 10)
                  .floor()
                  .toNumber()
              ] +
              STANDARD_DATA.TENS[
                dMod(d.log10().sub(3).div(m.times(30)), 10)
                  .floor()
                  .toNumber()
              ] +
              STANDARD_DATA.HUNDREDS[
                dMod(d.log10().sub(3).div(m.times(300)), 10)
                  .floor()
                  .toNumber()
              ] +
              STANDARD_DATA.MILESTONES[x] +
              "-";
          }

          txt +=
            STANDARD_DATA.ONES[
              dMod(d.log10().sub(3).div(3), 10).floor().toNumber()
            ] +
            STANDARD_DATA.TENS[
              dMod(d.log10().sub(3).div(30), 10).floor().toNumber()
            ] +
            STANDARD_DATA.HUNDREDS[
              dMod(d.log10().sub(3).div(300), 10).floor().toNumber()
            ];

          return txt;
        } else if (
          d.lt(Decimal.pow(10, Decimal.pow(10, 3003).times(3)).times(1e3))
        ) {
          const x = d.log10().sub(3).div(3).log10().div(3).floor().toNumber();
          const m = Decimal.pow(1000, x);

          let txt = dPlaces(mantissa, places) + " ";

          txt +=
            STANDARD_DATA.ONES[
              dMod(d.log10().sub(3).div(m.times(3)), 10)
                .floor()
                .toNumber()
            ] +
            STANDARD_DATA.TENS[
              dMod(d.log10().sub(3).div(m.times(30)), 10)
                .floor()
                .toNumber()
            ] +
            STANDARD_DATA.HUNDREDS[
              dMod(d.log10().sub(3).div(m.times(300)), 10)
                .floor()
                .toNumber()
            ];

          if (x >= 100) {
            txt +=
              STANDARD_DATA.MILESTONE_HUNDREDS[Math.floor(x / 100)] +
              STANDARD_DATA.MILESTONE_TENS[Math.floor(x / 10) % 10] +
              STANDARD_DATA.MILESTONES[x % 10] +
              "-";
          } else {
            txt +=
              STANDARD_DATA.MILESTONE_TENS[Math.floor(x / 10)] +
              STANDARD_DATA.MILESTONES[x % 10] +
              "-";
          }

          txt +=
            STANDARD_DATA.ONES[
              dMod(d.log10().sub(3).div(3), 10).floor().toNumber()
            ] +
            STANDARD_DATA.TENS[
              dMod(d.log10().sub(3).div(30), 10).floor().toNumber()
            ] +
            STANDARD_DATA.HUNDREDS[
              dMod(d.log10().sub(3).div(300), 10).floor().toNumber()
            ];

          return txt;
        } else {
          const superIndex = d
            .div(1e3)
            .log10()
            .div(3)
            .log10()
            .sub(3)
            .div(3)
            .log(1e3)
            .floor()
            .toNumber();

          if (STANDARD_DATA.SUPER_MS.length > superIndex)
            return STANDARD_DATA.SUPER_MS[superIndex];
          else return format(num, places, 2);
        }
      }

    default: // Scientific (2)
      return d.toStringWithDecimalPlaces(places);
  }
}

export function formatDistance(
  num: DecimalSource,
  notation = player.value.opts.distanceFormat
): string {
  switch (notation) {
    case 0: // Normal (0)
      for (let i = Object.keys(DISTANCES).length - 1; i >= 0; i--) {
        const name = Object.keys(DISTANCES)[i] as keyof typeof DISTANCES;
        const val = new Decimal(DISTANCES[name]);
        if (Decimal.lt(num, val) && i > 0) continue;

        if (name == "mlt") {
          if (true) {
            //! REPLACE "true" with condition to check if multiverse is capped
            if (Decimal.lt(num, val))
              return format(Decimal.div(num, DISTANCES.uni)) + " uni";
            return "??? uni";
          } else
            return format(Decimal.log10(num).div(val.log10())) + " " + name;
        }
        return format(Decimal.div(num, val)) + " " + name;
      }
      return "???";

    case 1: // Just Meters (1)
      return format(num) + " m";

    default: // Meters, Universes, and Multiverses (2)
      for (let i = Object.keys(LIMITED_DISTANCES).length - 1; i >= 0; i--) {
        const name = Object.keys(LIMITED_DISTANCES)[
          i
        ] as keyof typeof LIMITED_DISTANCES;
        const val = new Decimal(LIMITED_DISTANCES[name]);
        if (Decimal.lt(num, val) && i > 0) continue;

        if (name == "mlt") {
          if (true) {
            //! REPLACE "true" with condition to check if multiverse is capped
            if (Decimal.lt(num, val))
              return format(Decimal.div(num, LIMITED_DISTANCES.uni)) + " uni";
            return "??? uni";
          } else
            return format(Decimal.log10(num).div(val.log10())) + " " + name;
        }
        return format(Decimal.div(num, val)) + " " + name;
      }
      return "???";
  }
}

export function parseFunc<T>(f: T | (() => T)): T {
  if (f instanceof Function) return f();
  else return f;
}
