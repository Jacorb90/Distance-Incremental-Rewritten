import { player } from "@/main";
import { addFeature } from "@/util/feature";
import { DISTANCES, format, formatDistance, formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { hasAch } from "../achs/achs";
import { Automated } from "../auto/auto";

import type { DecimalSource } from "break_eternity.js";
import type { Feature } from "@/util/feature";
import { collapse, hasLEMil } from "../collapse/collapse";
import { hasRank, hasTier } from "../basics/basics";
import { pathogens } from "../pathogens/pathogens";

export const TR_UPGRADE_ROWS: number[] = [1, 2];
export const TR_UPGRADE_COLS = computed(() =>
  Object.keys(TR_UPGRADE_COSTS)
    .filter((name) => name.startsWith("1"))
    .map((s) => s.substring(1))
);

export const TR_UPGRADE_COSTS: Record<number, DecimalSource> = {
  11: 50,
  12: 240,
  13: 850,
  14: 1285,
  15: 2850,

  21: 4000,
  22: 7777,
  23: 12345,
  24: 18200,
  25: 25600,
};

type TimeReversalData = Record<
  number,
  {
    description: string;
    unl?: boolean;
    effect?: DecimalSource;
    effectDesc?: (eff: DecimalSource) => string;
  }
> & {
  timeSpeed: Decimal;
  timeCubeGain: Decimal;
  tru3Base: Decimal;
  tru7Base: Decimal;
  tru9Base: Decimal;
};

export const timeReversal: Feature<
  TimeReversalData,
  { buyUpg: (id: number) => void }
> = addFeature("timeReversal", 6, {
  unl: {
    reached: computed(() => Decimal.gte(player.distance, DISTANCES.ly)),
    desc: computed(
      () => `Reach ${formatDistance(DISTANCES.ly)} to unlock Time Reversal.`
    ),
  },

  data: {
    timeSpeed: computed(() => {
      let speed = Decimal.dOne;

      if (player.timeReversal.upgrades.includes(11))
        speed = Decimal.mul(speed, timeReversal.data[11].value.effect ?? 1);

      if (player.timeReversal.upgrades.includes(24))
        speed = Decimal.mul(speed, timeReversal.data[24].value.effect ?? 1);

      if (hasAch(27)) speed = speed.times(1.1);
      if (hasAch(47)) speed = speed.times(1.11);
      if (hasAch(58)) speed = speed.times(1.07);
      if (hasAch(68)) speed = speed.times(1.09);

      if (hasRank(50)) speed = speed.times(1.1);
      if (hasRank(75)) speed = speed.times(1.12);
      if (hasTier(13)) speed = speed.times(1.2);
      if (hasTier(24)) speed = speed.times(1.25);

      speed = Decimal.mul(speed, collapse.data.eff.value);

      if (hasLEMil(12))
        speed = Decimal.mul(speed, collapse.data[12].value.effect ?? 1);

      return speed;
    }),
    timeCubeGain: computed(() => {
      let gain = Decimal.div(player.distance, 2)
        .div(1e11)
        .plus(1)
        .root(10)
        .sub(1);

      if (player.timeReversal.upgrades.includes(12))
        gain = Decimal.mul(gain, timeReversal.data[12].value.effect ?? 1);

      if (player.timeReversal.upgrades.includes(21))
        gain = Decimal.mul(gain, timeReversal.data[21].value.effect ?? 1);

      if (hasLEMil(12))
        gain = Decimal.mul(gain, collapse.data[12].value.effect ?? 1);

      return gain;
    }),

    tru3Base: computed(() => {
      let base = new Decimal(3);
      if (pathogens.data[21].value.unl ?? true)
        base = base.plus(pathogens.data[21].value.effect);
      return base;
    }),
    tru7Base: computed(() => {
      let base = new Decimal(2);
      if (pathogens.data[43].value.unl ?? true)
        base = base.pow(pathogens.data[43].value.effect);
      return base;
    }),
    tru9Base: computed(() => {
      let base = new Decimal(1.04);
      if (pathogens.data[43].value.unl ?? true)
        base = base.pow(pathogens.data[43].value.effect);
      return base;
    }),

    11: computed(() => ({
      description: `Time goes by faster based on Time Cubes.`,
      effect: Decimal.add(player.timeReversal.cubes, 1).log10().plus(1),
    })),
    12: computed(() => ({
      description: `Increase Time Cube gain by ${formatWhole(
        player.auto[Automated.TimeReversalUpgrades].mastered ? 4 : 2
      )}% per Rank or Tier.`,
      effect: Decimal.pow(
        player.auto[Automated.TimeReversalUpgrades].mastered ? 1.04 : 1.02,
        Decimal.add(player.rank, player.tier)
      ),
    })),
    13: computed(() => ({
      description: `Increase Maximum Velocity & Acceleration by ${formatWhole(
        timeReversal.data.tru3Base.value
      )}% per Achievement.`,
      effect: Decimal.pow(
        Decimal.add(1, Decimal.div(timeReversal.data.tru3Base.value, 100)),
        player.achs.length
      ),
    })),
    14: computed(() => ({
      description: `Decrease Rank requirement scaling by ${formatWhole(10)}%.`,
    })),
    15: computed(() => ({
      description: `Add Extra Rocket Fuel based on Time Cubes.`,
      effect: player.timeReversal.upgrades.includes(25)
        ? Decimal.add(player.timeReversal.cubes, 1).log10().sqrt()
        : Decimal.add(player.timeReversal.cubes, 1).log10().sqrt().div(2),
      effectDesc: (eff) => `+${format(eff)}`,
    })),

    21: computed(() => ({
      description: `Increase Time Cube gain by  ${formatWhole(
        5
      )}% per Rocket Fuel bought.`,
      effect: Decimal.pow(1.05, player.rocketFuel),
    })),
    22: computed(() => ({
      description: `Divide the Rank requirement by ${format(
        timeReversal.data.tru7Base.value
      )} per Auto-Rank Efficiency Level.`,
      effect: Decimal.pow(
        timeReversal.data.tru7Base.value,
        player.auto[Automated.Ranks].level
      ),
      effectDesc: (eff) => `÷${format(eff)}`,
    })),
    23: computed(() => ({
      description: `Increase Rocket gain by ${formatWhole(
        10
      )}% per OoM of Time Cubes.`,
      effect: Decimal.pow(
        1.1,
        Decimal.log10(Decimal.add(player.timeReversal.cubes, 1))
      ),
    })),
    24: computed(() => ({
      description: `Increase Time Speed by ${format(
        Decimal.sub(timeReversal.data.tru9Base.value, 1).times(100)
      )}% per Auto-Tier Efficiency Level.`,
      effect: Decimal.pow(
        timeReversal.data.tru9Base.value,
        player.auto[Automated.Tiers].level
      ),
    })),
    25: computed(() => ({
      description: `Double the above upgrade's effect.`,
    })),
  },

  receptors: {
    tick: (diff) => {
      if (player.timeReversal.active) {
        player.distance = Decimal.div(player.distance, Decimal.pow(2, diff));

        player.timeReversal.cubes = Decimal.add(
          player.timeReversal.cubes,
          Decimal.mul(timeReversal.data.timeCubeGain.value, diff).times(
            timeReversal.data.timeSpeed.value
          )
        );
      }
    },

    reset: (id) => {
      if (id >= 3) {
        player.timeReversal = {
          active: false,
          cubes: 0,
          upgrades: [],
        };
      }
    },
  },

  actions: {
    buyUpg(id) {
      if (player.timeReversal.upgrades.includes(id)) return;
      if (Decimal.lt(player.timeReversal.cubes, TR_UPGRADE_COSTS[id])) return;

      player.timeReversal.cubes = Decimal.sub(
        player.timeReversal.cubes,
        TR_UPGRADE_COSTS[id]
      );
      player.timeReversal.upgrades.push(id);
    },
  },
});
