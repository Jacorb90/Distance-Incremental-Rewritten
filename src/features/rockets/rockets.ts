import { player } from "@/main";
import { addFeature, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { basics, hasRank, hasTier } from "../basics/basics";
import { rocketFuel } from "../rocketFuel/rocketFuel";

import type { Feature } from "@/util/feature";
import { hasAch } from "../achs/achs";
import { timeReversal } from "../timeReversal/timeReversal";
import { Automated } from "../auto/auto";
import { collapse, hasLEMil } from "../collapse/collapse";

interface RocketData {
  startingReq: Decimal;
  gainMult: Decimal;
  resetGain: Decimal;
  nextAt: Decimal;
  effExp: Decimal;
  effMult: Decimal;
  maxVelMult: Decimal;
  accMult: Decimal;
}

export const rockets: Feature<RocketData, { rocketUp: () => void }> =
  addFeature("rockets", 3, {
    unl: {
      reached: computed(() => Decimal.gte(player.distance, 1e6)),
      desc: computed(() => `Reach ${formatDistance(1e6)} to unlock Rockets.`),
    },

    data: {
      startingReq: computed(() => Decimal.div(1e6, rocketFuel.data.eff2.value)),

      gainMult: computed(() => {
        let mult = rocketFuel.data.eff3.value;

        if (player.timeReversal.upgrades.includes(23))
          mult = mult.times(timeReversal.data[23].value.effect ?? 1);

        if (hasAch(16)) mult = mult.times(2);
        if (hasRank(32)) mult = mult.times(1.2);
        if (hasRank(40)) mult = mult.times(1.25);

        if (hasTier(12)) mult = mult.times(Decimal.pow(1.05, player.rank));

        if (player.auto[Automated.Rockets].mastered) mult = mult.times(2.5);

        if (hasLEMil(24))
          mult = mult.times(collapse.data[24].value.effect ?? 1);

        if (hasAch(56)) mult = mult.times(1.09);

        return mult;
      }),

      resetGain: computed(() =>
        Decimal.div(player.distance, rockets.data.startingReq.value)
          .root(2.5)
          .times(rockets.data.gainMult.value)
          .floor()
      ),

      nextAt: computed(() =>
        Decimal.add(rockets.data.resetGain.value, 1)
          .div(rockets.data.gainMult.value)
          .pow(2.5)
          .times(rockets.data.startingReq.value)
      ),

      effExp: computed(() =>
        Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .plus(1)
          .log10()
          .plus(Decimal.gt(player.rockets, 0) ? 0.2 : 0)
          .sqrt()
          .times(1.5)
          .times(rocketFuel.data.eff4.value)
          .plus(hasAch(36) ? 0.1 : 0)
          .plus(hasAch(54) ? 0.05 : 0)
          .plus(hasLEMil(32) ? collapse.data[32].value.effect ?? 0 : 0)
      ),
      effMult: computed(() =>
        Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .plus(1)
          .sqrt()
          .times(2.5)
          .sub(2)
          .max(1)
          .times(rocketFuel.data.eff5.value)
      ),

      maxVelMult: computed(() =>
        Decimal.add(basics.data.preRocketMaxVelocity.value, 1)
          .log10()
          .plus(1)
          .pow(rockets.data.effExp.value)
          .times(rockets.data.effMult.value)
      ),

      accMult: computed(() =>
        Decimal.add(basics.data.preRocketAccel.value, 1)
          .log10()
          .plus(1)
          .pow(rockets.data.effExp.value)
          .times(rockets.data.effMult.value)
      ),
    },

    receptors: {
      reset: (id) => {
        if (id >= 3) {
          player.rockets = 0;
        }
      },
    },

    actions: {
      rocketUp: () => {
        const gain = rockets.data.resetGain.value;

        if (Decimal.lt(gain, 1)) return;

        player.rockets = Decimal.add(player.rockets, gain);

        signal("reset", 2);
      },
    },
  });
