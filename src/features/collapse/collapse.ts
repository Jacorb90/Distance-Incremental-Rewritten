import { player } from "@/main";
import { Feature, addFeature, signal } from "@/util/feature";
import { DISTANCES, format, formatDistance, formatWhole } from "@/util/format";
import Decimal, { DecimalSource } from "break_eternity.js";
import { computed } from "vue";
import { hasAch } from "../achs/achs";
import { rocketFuel } from "../rocketFuel/rocketFuel";
import { Automated } from "../auto/auto";
import { pathogens } from "../pathogens/pathogens";

export const COLLAPSE_MILESTONE_ROWS: number[] = [1, 2, 3, 4];
export const COLLAPSE_MILESTONE_COLS = computed(() =>
  Object.keys(COLLAPSE_MILESTONE_REQS)
    .filter((name) => name.startsWith("1"))
    .map((s) => s.substring(1))
);

export const COLLAPSE_MILESTONE_REQS: Record<number, DecimalSource> = {
  11: 40,
  12: 100,
  13: 225,
  14: 480,

  21: 1500,
  22: 2001,
  23: 3510,
  24: 6760,

  31: 8410,
  32: 1e4,
  33: 14700,
  34: 19400,

  41: 250e3,
  42: 1e6,
  43: "1.8e308",
  44: "1e10000",
};

export interface CollapseSaveData {
  cadavers: DecimalSource;
  spent: DecimalSource;
  milestones: number[];
}

export function startingCollapseSaveData(): CollapseSaveData {
  return {
    cadavers: 0,
    spent: 0,
    milestones: [],
  };
}

type CollapseData = Record<
  number,
  {
    description: string;
    unl?: boolean;
    effect?: DecimalSource;
    effectDesc?: (eff: DecimalSource) => string;
  }
> & {
  startingReq: Decimal;
  gainMult: Decimal;
  resetGain: Decimal;
  nextAt: Decimal;
  eff: Decimal;
  totalEssence: Decimal;
  essence: Decimal;

  essenceGain: Decimal;

  clm11Base: Decimal;
};

export function hasLEMil(n: number) {
  return (
    player.collapse.milestones.includes(n) &&
    (collapse.data[n].value.unl ?? true)
  );
}

export const collapse: Feature<CollapseData, { collapseUp: () => void }> =
  addFeature("collapse", 7, {
    unl: {
      reached: computed(() =>
        Decimal.gte(player.distance, Decimal.mul(50, DISTANCES.Mpc))
      ),
      desc: computed(
        () =>
          `Reach ${formatDistance(
            Decimal.mul(50, DISTANCES.Mpc)
          )} to unlock Collapse.`
      ),
    },

    data: {
      startingReq: computed(() => Decimal.mul(50, DISTANCES.Mpc)),
      gainMult: computed(() => {
        let mult = Decimal.dOne;

        if (hasLEMil(22))
          mult = mult.times(collapse.data[22].value.effect ?? 1);

        return mult;
      }),
      resetGain: computed(() =>
        Decimal.div(player.distance, collapse.data.startingReq.value)
          .root(4)
          .times(collapse.data.gainMult.value)
          .floor()
      ),
      nextAt: computed(() =>
        Decimal.add(collapse.data.resetGain.value, 1)
          .div(collapse.data.gainMult.value)
          .pow(4)
          .times(collapse.data.startingReq.value)
      ),
      eff: computed(() => {
        let e = Decimal.add(player.collapse.cadavers, 1).log2().plus(1);

        if (pathogens.data[41].value.unl ?? true)
          e = e.pow(Decimal.add(1, pathogens.data[41].value.effect));
        if (hasLEMil(11)) e = e.pow(collapse.data[11].value.effect ?? 1);

        return e;
      }),

      essenceGain: computed(() => {
        let gain = Decimal.add(player.collapse.cadavers, 1).log2();

        if (hasAch(38)) gain = gain.plus(1);
        if (hasAch(62)) gain = gain.plus(1);
        if (pathogens.data[31].value.unl ?? true)
          gain = gain.plus(pathogens.data[31].value.effect);

        return gain.floor();
      }),

      totalEssence: computed(() =>
        Decimal.mul(collapse.data.essenceGain.value, player.rank).times(
          player.tier
        )
      ),
      essence: computed(() =>
        Decimal.sub(
          collapse.data.totalEssence.value,
          player.collapse.spent
        ).max(0)
      ),

      clm11Base: computed(() => {
        let base = new Decimal(5);

        if (pathogens.data[22].value.unl ?? true)
          base = base.plus(pathogens.data[22].value.effect);

        return base;
      }),

      11: computed(() => ({
        description: `Life Essence powers up the Cadaver effect.`,
        effect: Decimal.add(collapse.data.essence.value, 1)
          .log10()
          .plus(1)
          .log(4)
          .plus(1),
        effectDesc: (e: DecimalSource) => `^${format(e)}`,
      })),
      12: computed(() => ({
        description: `Time Cube gain & Time Speed are increased by ${formatWhole(
          20
        )}% per Collapse Milestone earned.`,
        effect: Decimal.pow(1.2, player.collapse.milestones.length),
      })),
      13: computed(() => ({
        description: `Keep Rank Automation on reset.`,
      })),
      14: computed(() => ({
        description: `Keep Tier Automation on reset.`,
      })),

      21: computed(() => ({
        description: `Unlock the Rocket Fuel Autobuyer.`,
      })),
      22: computed(() => ({
        description: `Boost Cadaver gain based on Life Essence.`,
        effect: Decimal.div(collapse.data.essence.value, 10).plus(1).cbrt(),
      })),
      23: computed(() => ({
        description: `Unlock the Time Reversal Upgrade Autobuyer, and decrease the Rank requirement base by ${format(
          0.01
        )} per Collapse Milestone earned.`,
        effect: 0.01 * player.collapse.milestones.length,
        effectDesc: (e) => `-${format(e)}`,
      })),
      24: computed(() => ({
        description: `Multiply Rocket gain based on Cadavers.`,
        effect: Decimal.div(player.collapse.cadavers, 1000).sqrt().plus(1),
      })),

      31: computed(() => ({
        description: `Keep Rocket Automation on reset.`,
      })),
      32: computed(() => ({
        description: `Add ${format(
          0.1
        )} to the Rocket effect exponent per Rocket Fuel.`,
        effect: Decimal.mul(
          0.1,
          Decimal.add(player.rocketFuel, rocketFuel.data.extra.value)
        ),
        effectDesc: (e: DecimalSource) => `+${format(e)}`,
      })),
      33: computed(() => ({
        description: `Increase Max Velocity by ${formatWhole(
          collapse.data.clm11Base.value
        )}% per Auto-Rocket/Rocket Fuel Efficiency Level.`,
        effect: Decimal.pow(
          Decimal.add(1, Decimal.div(collapse.data.clm11Base.value, 100)),
          Decimal.add(
            player.auto[Automated.Rockets].level,
            player.auto[Automated.RocketFuel].level
          )
        ),
      })),
      34: computed(() => ({
        description: `Increase Rocket Fuel Power by ${format(0.2)}.`,
      })),

      41: computed(() => ({
        unl: player.featuresUnl.includes("pathogens"),
        description: `Multiply Rocket gain by Life Essence.`,
        effect: collapse.data.essence.value,
      })),
      42: computed(() => ({
        unl: player.featuresUnl.includes("pathogens"),
        description: `Increase Pathogen gain by ${formatWhole(1)}% per Rank.`,
        effect: Decimal.pow(1.01, player.rank),
      })),
      43: computed(() => ({
        unl: false,
        description: `?????`,
      })),
      44: computed(() => ({
        unl: false,
        description: `?????`,
      })),
    },

    receptors: {
      reset: (id) => {
        if (id >= 3) {
          player.collapse.spent = 0;
        }
        if (id >= 4) {
          player.collapse = startingCollapseSaveData();
        }
      },

      tick: (diff) => {
        COLLAPSE_MILESTONE_ROWS.forEach((row) => {
          COLLAPSE_MILESTONE_COLS.value.forEach((col) => {
            const id = Number(row + col);
            if (
              !player.collapse.milestones.includes(id) &&
              (collapse.data[id].value.unl ?? true) &&
              Decimal.gte(
                collapse.data.essence.value,
                COLLAPSE_MILESTONE_REQS[id]
              )
            ) {
              player.collapse.milestones.push(id);
            }
          });
        });
      },
    },

    actions: {
      collapseUp() {
        const gain = collapse.data.resetGain.value;

        if (Decimal.lt(gain, 1)) return;

        player.collapse.cadavers = Decimal.add(player.collapse.cadavers, gain);

        signal("reset", 3);
      },
    },
  });
