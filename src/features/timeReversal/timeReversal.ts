import { player } from "@/main";
import { addFeature } from "@/util/feature";
import { DISTANCES, format, formatDistance, formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { hasAch } from "../achs/achs";

import type { DecimalSource } from "break_eternity.js";
import type { Feature } from "@/util/feature";

export const TR_UPGRADE_COSTS: Record<number, DecimalSource> = {
  11: 50,
  12: 240,
  13: 850,
  14: 1285,
  15: 2850,
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

      if (hasAch(27)) speed = speed.times(1.1);
      if (hasAch(47)) speed = speed.times(1.11);

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

      return gain;
    }),
    11: computed(() => ({
      description: `Time goes by faster based on Time Cubes.`,
      effect: Decimal.add(player.timeReversal.cubes, 1).log10().plus(1),
    })),
    12: computed(() => ({
      description: `Increase Time Cube gain by ${formatWhole(
        2
      )}% per Rank or Tier.`,
      effect: Decimal.pow(1.02, Decimal.add(player.rank, player.tier)),
    })),
    13: computed(() => ({
      description: `Increase Maximum Velocity & Acceleration by ${formatWhole(
        3
      )}% per Achievement.`,
      effect: Decimal.pow(1.03, player.achs.length),
    })),
    14: computed(() => ({
      description: `Decrease Rank requirement scaling by ${formatWhole(10)}%.`,
    })),
    15: computed(() => ({
      description: `Add Extra Rocket Fuel based on Time Cubes.`,
      effect: Decimal.add(player.timeReversal.cubes, 1).log10().sqrt().div(2),
      effectDesc: (eff) => `+${format(eff)}`,
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
