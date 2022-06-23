import { player } from "@/main";
import { addFeature, Feature } from "@/util/feature";
import { format, formatDistance, formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import { Notify } from "quasar";
import Decimal from "break_eternity.js";
import { watch } from "vue";

type AchData = Record<
  number,
  {
    unl: boolean;
    desc: string;
    reward?: string;
  }
>;

export const ACH_NAMES: Record<number, string> = {
  11: "Quick Sprint",
  12: "Better Shoes",
  13: "Extreme Workout",
  14: "Off to Space!",
  15: "Rocket Blast",

  21: "Driving for Hours",
  22: "Oil Change",
  23: "Fifth Time's the Charm",
  24: "Repeated Blasts",
  25: "Refuel",

  31: "Just Under a Saturn Revolution",
  32: "Putting in the Fake Fuel",
  33: "The Upper Echelon",
  34: "Super Engineer",
  35: "Coal isn't Enough!",
};

const ACH_IDS = Object.keys(ACH_NAMES).map(Number);

export const achs: Feature<AchData, {}> = addFeature("achs", {
  unl: {
    reached: computed(() => true),
    desc: computed(() => ""),
  },

  data: {
    11: computed(() => ({
      unl: Decimal.gte(player.distance, 100),
      desc: `Reach ${formatDistance(100)}.`,
    })),

    12: computed(() => ({
      unl: Decimal.gte(player.rank, 2),
      desc: `Reach Rank ${formatWhole(2)}.`,
      reward: `Increase Acceleration by ${formatWhole(5)}%.`,
    })),

    13: computed(() => ({
      unl: Decimal.gte(player.tier, 1),
      desc: `Reach Tier ${formatWhole(1)}.`,
    })),

    14: computed(() => ({
      unl: Decimal.gte(player.rockets, 1),
      desc: `Get ${formatWhole(1)} Rocket.`,
      reward: `Increase Acceleration and Maximum Velocity by ${formatWhole(
        15
      )}%.`,
    })),

    15: computed(() => ({
      unl: Decimal.gte(player.rocketFuel, 1),
      desc: `Get ${formatWhole(1)} Rocket Fuel.`,
      reward: `Decrease the Tier requirement by ${formatWhole(1)} Rank.`,
    })),

    21: computed(() => ({
      unl: Decimal.gte(player.distance, 5e5),
      desc: `Reach ${formatDistance(5e5)}.`,
      reward: `Increase Maximum Velocity by ${formatWhole(5)}%.`,
    })),

    22: computed(() => ({
      unl: Decimal.gte(player.rank, 8),
      desc: `Reach Rank ${formatWhole(8)}`,
      reward: `Increase Acceleration by ${formatWhole(6)}%.`,
    })),

    23: computed(() => ({
      unl: Decimal.gte(player.tier, 5),
      desc: `Reach Tier ${formatWhole(5)}.`,
      reward: `Decrease the Rank requirement by ${formatWhole(5)}%.`,
    })),

    24: computed(() => ({
      unl: Decimal.gte(player.rockets, 10),
      desc: `Reach ${formatWhole(10)} Rockets.`,
      reward: `Increase Maximum Velocity by ${format(0.5)} m/s.`,
    })),

    25: computed(() => ({
      unl: Decimal.gte(player.rocketFuel, 3),
      desc: `Reach ${formatWhole(3)} Rocket Fuel.`,
      reward: `Decrease the Tier requirement by ${formatWhole(1)} Rank again.`,
    })),

    31: computed(() => ({
      unl: Decimal.gte(player.distance, 1e12),
      desc: `Reach ${formatDistance(1e12)}.`,
    })),

    32: computed(() => ({
      unl: Decimal.gte(player.rank, 12),
      desc: `Reach Rank ${formatWhole(12)}.`,
      reward: `Increase Acceleration by ${formatWhole(7)}%.`,
    })),

    33: computed(() => ({
      unl: Decimal.gte(player.tier, 7),
      desc: `Reach Tier ${formatWhole(7)}.`,
    })),

    34: computed(() => ({
      unl: Decimal.gte(player.rockets, 500),
      desc: `Reach ${formatWhole(500)} Rockets.`,
      reward: `Increase Acceleration by ${format(0.02)} m/s.`,
    })),

    35: computed(() => ({
      unl: Decimal.gte(player.rocketFuel, 5),
      desc: `Reach ${formatWhole(5)} Rocket Fuel.`,
      reward: `Start at Tier ${formatWhole(1)} on reset.`,
    })),
  },

  receptors: {
    load: () => {
      ACH_IDS.forEach((i) =>
        watch(achs.data[i], (data) => {
          if (data.unl && !player.achs.includes(i)) {
            player.achs.push(i);

            Notify.create({
              message: ACH_NAMES[i],
              caption: "Achievement gotten!",
              position: "top-right",
              icon: "emoji_events",
              color: "warning",
              timeout: 1500,
              badgeStyle: "opacity: 0;",
            });
          }
        })
      );
    },
  },

  actions: {},
});

export function hasAch(id: number) {
  return player.achs.includes(id);
}
