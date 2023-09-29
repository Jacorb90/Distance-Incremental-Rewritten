import { player } from "@/main";
import {
  CostFormula,
  ValuePacket,
  createExponentialCBF,
  createPolyExponentialCBF,
} from "@/util/calc";
import { Feature, addFeature } from "@/util/feature";
import { format, formatWhole } from "@/util/format";
import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { timeReversal } from "../timeReversal/timeReversal";
import { hasAch } from "../achs/achs";
import { collapse, hasLEMil } from "../collapse/collapse";
import { Automated } from "../auto/auto";

export interface PathogensSaveData {
  amount: DecimalSource;
  upgrades: Record<number, DecimalSource>;
}

export function startingPathogensSaveData(): PathogensSaveData {
  return {
    amount: 10,
    upgrades: {},
  };
}

export const PATHOGEN_UPGS: number[][] = [
  [11],
  [21, 22],
  [31, 32, 33],
  [
    41, 42,
    // 43,
    44,
  ],
];

type PathogensData = Record<
  number,
  {
    name: string;
    description: string;
    extra?: Decimal;
    unl?: boolean;
    effect: Decimal;
    effectDesc: string;
  }
> & {
  pathogenEffExp: Decimal;
  pathogenEff: Decimal;
  pathogenGain: Decimal;
  totalUpgs: DecimalSource;
};

const pathogenAmtComputed = computed(() => player.pathogens.amount);
function createPathogenVP(upgID: number): ValuePacket {
  return {
    amt: computed(() => player.pathogens.upgrades[upgID] ?? 0),
    res: pathogenAmtComputed,
  };
}

export const pathogenUpgCostFormulas: Record<number, CostFormula> = {
  11: createExponentialCBF(10, 1.1, createPathogenVP(11)),
  21: createPolyExponentialCBF(25, 1.4, 1.1, createPathogenVP(21)),
  22: createPolyExponentialCBF(40, 1.1025, 1.21, createPathogenVP(22)),
  31: createPolyExponentialCBF(500, 1.01, 1.15, createPathogenVP(31)),
  32: createPolyExponentialCBF(1e4, 2, 2, createPathogenVP(32)),
  33: createPolyExponentialCBF(2.5e3, 1.2, 1.6, createPathogenVP(33)),
  41: createPolyExponentialCBF(1.5e8, 1.3, 1.4, createPathogenVP(41)),
  42: createPolyExponentialCBF(2.5e10, 1.08, 1.35, createPathogenVP(42)),
  // 43
  44: createPolyExponentialCBF(1e5, 1.15, 1.7, createPathogenVP(44)),
};

export const pathogens: Feature<
  PathogensData,
  { buyPathogenUpg: (n: number, max: boolean) => void }
> = addFeature("pathogens", 8, {
  unl: {
    reached: computed(() => Decimal.gte(player.collapse.cadavers, 25e9)),
    desc: computed(() => `Reach ${format(25e9)} Cadavers to unlock Pathogens.`),
  },

  data: {
    pathogenEffExp: computed(() => {
      let exp = Decimal.dOne;
      if (pathogens.data[32].value.unl ?? true)
        exp = exp.plus(pathogens.data[32].value.effect);
      return exp;
    }),
    pathogenEff: computed(() =>
      Decimal.add(player.pathogens.amount, 1)
        .log10()
        .plus(1)
        .pow(pathogens.data.pathogenEffExp.value)
    ),
    pathogenGain: computed(() => {
      let gain = Decimal.mul(
        pathogens.data.pathogenEff.value,
        pathogens.data[11].value.effect
      );
      if (hasAch(65)) gain = gain.times(1.04);
      if (hasLEMil(42)) gain = gain.times(collapse.data[42].value.effect ?? 1);
      return gain;
    }),
    totalUpgs: computed(() =>
      Object.keys(player.pathogens.upgrades)
        .map(Number)
        .reduce(
          (a, id) =>
            Decimal.add(a, player.pathogens.upgrades[id] ?? 0).plus(
              pathogens.data[id].value.extra ?? 0
            ),
          Decimal.dZero
        )
    ),

    11: computed(() => {
      const extra = pathogens.data[42].value.effect;
      const effect = Decimal.mul(
        Decimal.add(player.pathogens.upgrades[11] ?? 0, extra),
        2e-7
      );
      return {
        name: "Viral Creation",
        description: `Generate ${format(2e-7)} Pathogens/s.`,
        extra,
        effect,
        effectDesc: `${format(effect)}/s`,
      };
    }),

    21: computed(() => {
      const extra = pathogens.data[42].value.effect;
      const effect = new Decimal(player.pathogens.upgrades[21] ?? 0).plus(
        extra
      );
      return {
        unl: Decimal.gte(player.pathogens.upgrades[11] ?? 0, 1),
        name: "Viral Reversal",
        description: `Increase Time Reversal Upgrade 3's base by ${formatWhole(
          1
        )}.`,
        extra,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),
    22: computed(() => {
      const extra = pathogens.data[42].value.effect;
      const effect = new Decimal(player.pathogens.upgrades[22] ?? 0).plus(
        extra
      );
      return {
        unl: Decimal.gte(player.pathogens.upgrades[11] ?? 0, 1),
        name: "Viral Ferocity",
        description: `Increase Collapse Milestone 11's base by ${formatWhole(
          1
        )}.`,
        extra,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),

    31: computed(() => {
      const effect = new Decimal(player.pathogens.upgrades[31] ?? 0);
      return {
        unl: Decimal.gte(player.pathogens.upgrades[21] ?? 0, 1),
        name: "Viral Survivability",
        description: `Increase Life Essence gain by ${formatWhole(1)}.`,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),
    32: computed(() => {
      const effect = new Decimal(player.pathogens.upgrades[32] ?? 0);
      return {
        unl:
          Decimal.gte(player.pathogens.upgrades[31] ?? 0, 1) &&
          Decimal.gte(player.pathogens.upgrades[33] ?? 0, 1),
        name: "Viral Evolution",
        description: `Increase the Pathogen Effect's exponent by ${format(1)}.`,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),
    33: computed(() => {
      const effect = new Decimal(player.pathogens.upgrades[33] ?? 0);
      return {
        unl: Decimal.gte(player.pathogens.upgrades[22] ?? 0, 1),
        name: "Viral Extensionality",
        description: `Add ${formatWhole(1)} extra Rocket Fuel.`,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),

    41: computed(() => {
      const effect = Decimal.div(player.pathogens.upgrades[41] ?? 0, 100);
      return {
        unl: Decimal.gte(player.pathogens.upgrades[31] ?? 0, 1),
        name: "Viral Lethality",
        description: `Increase the Cadaver effect exponent by ${format(0.01)}.`,
        effect,
        effectDesc: `+${format(effect)}`,
      };
    }),
    42: computed(() => {
      const effect = Decimal.mul(
        player.pathogens.upgrades[42] ?? 0,
        player.auto[Automated.TimeReversalUpgrades].level
      );
      return {
        unl:
          Decimal.gte(player.pathogens.upgrades[41] ?? 0, 1) &&
          Decimal.gte(player.pathogens.upgrades[44] ?? 0, 1),
        name: "Viral Contagion",
        description: `Add ${formatWhole(
          1
        )} extra level to the first two rows of Pathogen Upgrades per Auto-TR Upgrade Efficiency Level.`,
        effect,
        effectDesc: `+${formatWhole(effect)}`,
      };
    }),
    44: computed(() => {
      const effect = Decimal.div(player.pathogens.upgrades[44] ?? 0, 25);
      return {
        unl: Decimal.gte(player.pathogens.upgrades[33] ?? 0, 1),
        name: "Viral Proficiency",
        description: `Increase Rocket Fuel Power by ${format(0.04)}.`,
        effect,
        effectDesc: `+${format(effect)}`,
      };
    }),
  },

  receptors: {
    reset: (id) => {
      if (id >= 4) {
        player.pathogens = startingPathogensSaveData();
      }
    },

    tick(diff) {
      if (player.featuresUnl.includes("pathogens")) {
        player.pathogens.amount = Decimal.add(
          player.pathogens.amount,
          Decimal.mul(pathogens.data.pathogenGain.value, diff).times(
            timeReversal.data.timeSpeed.value
          )
        );
      }
    },
  },

  actions: {
    buyPathogenUpg(n, max) {
      if (
        Decimal.lt(
          player.pathogens.amount,
          pathogenUpgCostFormulas[n].cost.value
        )
      )
        return;

      if (max) {
        const target = pathogenUpgCostFormulas[n].target.value;
        player.pathogens.amount = Decimal.sub(
          player.pathogens.amount,
          pathogenUpgCostFormulas[n].accCost.value
        );
        player.pathogens.upgrades[n] = Decimal.max(
          player.pathogens.upgrades[n] ?? 0,
          target
        );
      } else {
        player.pathogens.amount = Decimal.sub(
          player.pathogens.amount,
          pathogenUpgCostFormulas[n].cost.value
        );
        player.pathogens.upgrades[n] = Decimal.add(
          player.pathogens.upgrades[n] ?? 0,
          1
        );
      }
    },
  },
});
