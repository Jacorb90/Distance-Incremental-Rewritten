import { player } from "@/main";
import Decimal from "break_eternity.js";
import { addFeature } from "@/util/feature";
import { hasAch } from "../achs/achs";
import { computed } from "vue";
import { format, formatWhole } from "@/util/format";
import { basics } from "../basics/basics";

import type { Feature } from "@/util/feature";
import type { ComputedRef } from "vue";
import { rockets } from "../rockets/rockets";

export enum Automated {
  Ranks,
  Tiers,
  Rockets,
}

export const AUTO_COUNT = 3;

type AutoData = Record<
  Automated,
  {
    visible: boolean;
    unl: boolean;
    desc: string;
    power: Decimal;
    upgReq: Decimal;
    canBuyUpg: boolean;
    masteryDesc: string;
  }
>;

interface AutoActions {
  upgrade: (type: Automated) => void;
  master: (type: Automated) => void;
  toggle: (type: Automated) => void;
}

type AutoExtensions = {
  constants: Record<
    Automated,
    {
      upgResName: string;
      masteryReq: number | string;
    }
  >;
};

export function generateInitialAutoState() {
  return new Array(AUTO_COUNT)
    .fill({
      unl: false,
      active: false,
      mastered: false,
      level: 0,
    })
    .reduce((acc, cur, i) => {
      acc[i as Automated] = { ...cur };
      return acc;
    }, {} as Record<Automated, { unl: boolean; active: boolean; mastered: boolean; level: number }>);
}

export const auto: Feature<
  AutoData,
  AutoActions,
  AutoExtensions,
  {
    [key in keyof AutoData]: {
      [key2 in keyof AutoData[key]]: ComputedRef<AutoData[key][key2]>;
    };
  }
> = addFeature("auto", 5, {
  unl: {
    reached: computed(() => Decimal.gte(player.rockets, 1e4)),
    desc: computed(
      () => `Reach ${formatWhole(1e4)} Rockets to unlock Automation.`
    ),
  },

  data: {
    [Automated.Ranks]: {
      visible: computed(() => player.featuresUnl.includes("auto")),
      unl: computed(() => player.featuresUnl.includes("auto")),
      desc: computed(() => `Nothing :)`),
      power: computed(() =>
        Decimal.div(player.auto[Automated.Ranks].level, 3).plus(1).log(4).min(1)
      ),
      upgReq: computed(() =>
        Decimal.pow(
          2,
          Decimal.pow(player.auto[Automated.Ranks].level, 2)
        ).times(1e3)
      ),
      canBuyUpg: computed(() =>
        Decimal.gte(player.rockets, auto.data[Automated.Ranks].upgReq.value)
      ),
      masteryDesc: computed(
        () => `Reduce Rank requirement base by ${format(0.1)}.`
      ),
    },
    [Automated.Tiers]: {
      visible: computed(() => player.featuresUnl.includes("auto")),
      unl: computed(() => Decimal.gte(player.rockets, 1e5)),
      desc: computed(() => `${formatWhole(1e5)} Rockets`),
      power: computed(() =>
        Decimal.div(player.auto[Automated.Tiers].level, 4).plus(1).log(4).min(1)
      ),
      upgReq: computed(() =>
        Decimal.pow(
          3,
          Decimal.pow(player.auto[Automated.Tiers].level, 2)
        ).times(1e4)
      ),
      canBuyUpg: computed(() =>
        Decimal.gte(player.rockets, auto.data[Automated.Tiers].upgReq.value)
      ),
      masteryDesc: computed(
        () => `Decrease Tier requirement by ${formatWhole(20)}%.`
      ),
    },
    [Automated.Rockets]: {
      visible: computed(() => hasAch(17)),
      unl: computed(() => Decimal.gte(player.timeReversal.cubes, 1e3)),
      desc: computed(() => `${formatWhole(1e3)} Time Cubes`),
      power: computed(() =>
        Decimal.div(player.auto[Automated.Rockets]?.level ?? 0, 80)
          .plus(1)
          .log(4)
          .min(1)
      ),
      upgReq: computed(() =>
        Decimal.pow(
          1.5,
          Decimal.pow(player.auto[Automated.Rockets].level, 2)
        ).times(500)
      ),
      canBuyUpg: computed(() =>
        Decimal.gte(
          player.timeReversal.cubes,
          auto.data[Automated.Rockets].upgReq.value
        )
      ),
      masteryDesc: computed(() => `Multiply Rocket gain by ${format(2.5)}.`),
    },
  },

  constants: {
    [Automated.Ranks]: {
      upgResName: "Rockets",
      masteryReq: 1e14,
    },
    [Automated.Tiers]: {
      upgResName: "Rockets",
      masteryReq: 2.5e15,
    },
    [Automated.Rockets]: {
      upgResName: "Time Cubes",
      masteryReq: "1e40",
    },
  },

  receptors: {
    tick: (diff) => {
      if (player.auto[Automated.Ranks].active) {
        player.rank = Decimal.max(player.rank, basics.data.rankTarget.value);
      }
      if (player.auto[Automated.Tiers].active) {
        player.tier = Decimal.max(player.tier, basics.data.tierTarget.value);
      }
      if (player.auto[Automated.Rockets].active) {
        player.rockets = Decimal.mul(rockets.data.resetGain.value, diff)
          .times(auto.data[Automated.Rockets].power.value)
          .plus(player.rockets);
      }
    },

    reset: (id) => {
      if (id >= 3) {
        player.auto = generateInitialAutoState();
      }
    },
  },

  actions: {
    upgrade: (type) => {
      switch (auto.constants[type].upgResName) {
        case "Time Cubes":
          if (
            Decimal.lt(player.timeReversal.cubes, auto.data[type].upgReq.value)
          )
            return;

          player.timeReversal.cubes = Decimal.sub(
            player.timeReversal.cubes,
            auto.data[type].upgReq.value
          );
          break;

        default:
          if (Decimal.lt(player.rockets, auto.data[type].upgReq.value)) return;

          player.rockets = Decimal.sub(
            player.rockets,
            auto.data[type].upgReq.value
          );
      }
      player.auto[type].level = Decimal.add(player.auto[type].level, 1);
    },

    master: (type) => {
      if (
        player.auto[type].mastered ||
        Decimal.lt(player.distance, auto.constants[type].masteryReq)
      )
        return;

      player.distance = Decimal.sub(
        player.distance,
        auto.constants[type].masteryReq
      );
      player.auto[type].mastered = true;
    },

    toggle: (type) => {
      if (Decimal.eq(player.auto[type].level, 0)) return;

      player.auto[type].active = !player.auto[type].active;
    },
  },

  watchers: new Array(AUTO_COUNT).fill({}).map((_, i) => {
    const a = i as Automated;
    return () => {
      if (player.auto[a] === undefined) {
        player.auto[a] = {
          unl: false,
          active: false,
          mastered: false,
          level: 0,
        };
      } else if (!player.auto[a].unl && auto.data[a].unl.value)
        player.auto[a].unl = true;
    };
  }),
});
