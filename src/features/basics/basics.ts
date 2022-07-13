import { player } from "@/main";
import { addFeature, signal } from "@/util/feature";
import { format, formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { hasAch } from "../achs/achs";
import { rocketFuel } from "../rocketFuel/rocketFuel";
import { rockets } from "../rockets/rockets";
import { auto, Automated } from "../auto/auto";
import { timeReversal } from "../timeReversal/timeReversal";

import type { Feature } from "@/util/feature";
import type { ComputedRef } from "@vue/reactivity";
import type { DecimalSource } from "break_eternity.js";

export const RANK_DESCS: Record<number, ComputedRef<string>> = {
  2: computed(() => `increase Maximum Velocity by ${formatWhole(1)} m/s.`),
  3: computed(
    () =>
      `increase Acceleration and Maximum Velocity by ${formatWhole(
        10
      )}% per Rank.`
  ),
  4: computed(
    () =>
      `double Acceleration and decrease the Rank requirement base by ${format(
        0.3
      )}.`
  ),
  5: computed(() => `triple Acceleration and Maximum Velocity.`),
  6: computed(
    () =>
      `double Accleration and Maximum Velocity, and decrease the Rank requirement base by ${format(
        0.25
      )}.`
  ),
  7: computed(
    () => `increase Maximum Velocity by ${formatWhole(10)}% per Rank.`
  ),
  8: computed(() => `increase Acceleration by ${formatWhole(10)}% per Rank.`),
  10: computed(() => `increase Acceleration by ${formatWhole(50)}%.`),
  12: computed(() => `double Maximum Velocity.`),
  13: computed(() => `increase Acceleration by ${formatWhole(40)}%.`),
  15: computed(() => `double Maximum Velocity.`),
  18: computed(() => `double Maximum Velocity.`),
  20: computed(
    () => `increase Maximum Velocity by ${formatWhole(10)}% per Rank.`
  ),
  25: computed(() => `double Acceleration and Maximum Velocity.`),
};

export const TIER_DESCS: Record<number, ComputedRef<string>> = {
  1: computed(
    () =>
      `increase Acceleration by ${format(
        0.03
      )} m/s^2, and increase Maximum Velocity by ${formatWhole(20)}%.`
  ),
  2: computed(
    () =>
      `double Acceleration and quintuple Maximum Velocity if you are at least Rank ${formatWhole(
        3
      )}.`
  ),
  3: computed(
    () => `double Maximum Velocity, and halve Rank requirement per Tier.`
  ),
  4: computed(() => `double Acceleration and Maximum Velocity per Tier.`),
  5: computed(() => `double Acceleration and Maximum Velocity`),
  6: computed(() => `triple Acceleration.`),
  7: computed(() => `decrease Rank requirement scaling by 5%.`),
  8: computed(() => `decrease Rank requirement scaling by 5%.`),
  9: computed(() => `decrease the Rank requirement base by 0.05.`),
  10: computed(() => `triple Maximum Velocity.`),
};

interface BasicData {
  rank3Reward: Decimal;
  tier3Reward: Decimal;
  preRocketAccel: DecimalSource;
  preRocketMaxVelocity: DecimalSource;
  accel: Decimal;
  maxVelocity: Decimal;
  rankReqBase: number;
  rankReqDiv: Decimal;
  rankGainMult: number;
  rankReq: Decimal;
  rankTarget: Decimal;
  tierReqSub: number;
  tierReqDiv: number;
  tierReq: Decimal;
  tierTarget: Decimal;
}

interface BasicActions {
  rankUp: () => void;
  tierUp: () => void;
}

export const basics: Feature<BasicData, BasicActions> = addFeature(
  "basics",
  2,
  {
    unl: {
      reached: computed(() => true),
      desc: computed(() => ""),
    },

    data: {
      rank3Reward: computed(() => Decimal.pow(1.1, player.rank)),
      tier3Reward: computed(() => Decimal.pow(2, player.tier)),
      preRocketAccel: computed(() => {
        let acc: DecimalSource = 0.05;

        if (hasTier(1)) acc += 0.03;
        if (hasAch(34)) acc += 0.02;

        if (hasRank(3)) acc = Decimal.mul(acc, basics.data.rank3Reward.value);
        if (hasRank(4)) acc = Decimal.mul(acc, 2);
        if (hasRank(5)) acc = Decimal.mul(acc, 3);
        if (hasRank(6)) acc = Decimal.mul(acc, 2);
        if (hasRank(8)) acc = Decimal.mul(acc, basics.data.rank3Reward.value);
        if (hasRank(10)) acc = Decimal.mul(acc, 1.5);
        if (hasRank(13)) acc = Decimal.mul(acc, 1.4);
        if (hasRank(25)) acc = Decimal.mul(acc, 2);

        if (hasTier(2) && hasRank(3)) acc = Decimal.mul(acc, 2);
        if (hasTier(4)) acc = Decimal.mul(acc, basics.data.tier3Reward.value);
        if (hasTier(5)) acc = Decimal.mul(acc, 2);
        if (hasTier(6)) acc = Decimal.mul(acc, 3);

        if (hasAch(12)) acc = Decimal.mul(acc, 1.05);
        if (hasAch(14)) acc = Decimal.mul(acc, 1.15);
        if (hasAch(22)) acc = Decimal.mul(acc, 1.06);
        if (hasAch(32)) acc = Decimal.mul(acc, 1.07);
        if (hasAch(45)) acc = Decimal.mul(acc, 1.11);

        if (player.timeReversal.upgrades.includes(13))
          acc = Decimal.mul(acc, timeReversal.data[13].value.effect ?? 1);

        return acc;
      }),
      preRocketMaxVelocity: computed(() => {
        let vel: DecimalSource = 1;

        if (hasRank(2)) vel++;

        if (hasRank(3)) vel = Decimal.mul(vel, basics.data.rank3Reward.value);
        if (hasRank(5)) vel = Decimal.mul(vel, 3);
        if (hasRank(6)) vel = Decimal.mul(vel, 2);
        if (hasRank(7)) vel = Decimal.mul(vel, basics.data.rank3Reward.value);
        if (hasRank(12)) vel = Decimal.mul(vel, 2);
        if (hasRank(15)) vel = Decimal.mul(vel, 2);
        if (hasRank(18)) vel = Decimal.mul(vel, 2);
        if (hasRank(20)) vel = Decimal.mul(vel, basics.data.rank3Reward.value);
        if (hasRank(25)) vel = Decimal.mul(vel, 2);

        if (hasTier(1)) vel = Decimal.mul(vel, 1.2);
        if (hasTier(2) && hasRank(3)) vel = Decimal.mul(vel, 5);
        if (hasTier(3)) vel = Decimal.mul(vel, 2);
        if (hasTier(4)) vel = Decimal.mul(vel, basics.data.tier3Reward.value);
        if (hasTier(5)) vel = Decimal.mul(vel, 2);
        if (hasTier(10)) vel = Decimal.mul(vel, 3);

        if (hasAch(14)) vel = Decimal.mul(vel, 1.15);
        if (hasAch(21)) vel = Decimal.mul(vel, 1.05);
        if (hasAch(41)) vel = Decimal.mul(vel, 1.27);

        if (player.timeReversal.upgrades.includes(13))
          vel = Decimal.mul(vel, timeReversal.data[13].value.effect ?? 1);

        return vel;
      }),
      accel: computed(() =>
        Decimal.mul(
          basics.data.preRocketAccel.value,
          rockets.data.accMult.value
        )
      ),
      maxVelocity: computed(() =>
        Decimal.mul(
          basics.data.preRocketMaxVelocity.value,
          rockets.data.maxVelMult.value
        )
      ),

      rankReqBase: computed(() => {
        let base = 2;

        if (hasRank(4)) base -= 0.3;
        if (hasRank(6)) base -= 0.25;
        if (hasTier(9)) base -= 0.05;
        if (player.auto[Automated.Ranks].mastered) base -= 0.1;

        return base;
      }),
      rankReqDiv: computed(() => {
        let div = Decimal.dOne;

        if (hasTier(3)) div = Decimal.mul(div, basics.data.tier3Reward.value);

        div = Decimal.mul(div, rocketFuel.data.eff2.value);

        if (hasAch(23)) div = Decimal.div(div, 0.95);
        if (hasAch(43)) div = Decimal.div(div, 0.88);

        return div;
      }),
      rankGainMult: computed(() => {
        let mult = 1;

        if (hasTier(7)) mult += 0.05;
        if (hasTier(8)) mult += 0.05;

        if (player.timeReversal.upgrades.includes(14)) mult += 0.1;

        return mult;
      }),
      rankReq: computed(() => {
        const req = Decimal.pow(
          basics.data.rankReqBase.value,
          Decimal.sub(player.rank, 1).div(basics.data.rankGainMult.value).pow(2)
        ).times(10);

        return Decimal.div(req, basics.data.rankReqDiv.value);
      }),

      rankTarget: computed(() => {
        const amt = Decimal.mul(
          player.distance,
          basics.data.rankReqDiv.value
        ).times(auto.data[Automated.Ranks].power.value);

        if (Decimal.lt(amt, 10)) return Decimal.dZero;

        return amt
          .div(10)
          .max(1)
          .log(basics.data.rankReqBase.value)
          .sqrt()
          .times(basics.data.rankGainMult.value)
          .plus(2)
          .floor();
      }),

      tierReqSub: computed(() => {
        let sub = 0;

        if (hasAch(15)) sub++;
        if (hasAch(25)) sub++;

        return sub;
      }),
      tierReqDiv: computed(() => {
        let div = 1;

        if (player.auto[Automated.Tiers].mastered) div += 0.2;

        return div;
      }),

      tierReq: computed(() => {
        const req = Decimal.pow(player.tier, 2)
          .div(5)
          .plus(player.tier)
          .div(basics.data.tierReqDiv.value)
          .plus(3);

        return req.sub(basics.data.tierReqSub.value).floor();
      }),
      tierTarget: computed(() => {
        const amt = Decimal.mul(
          player.rank,
          auto.data[Automated.Tiers].power.value
        ).plus(basics.data.tierReqSub.value);

        if (Decimal.lt(amt, 3)) return Decimal.dZero;

        return amt
          .sub(3)
          .times(basics.data.tierReqDiv.value)
          .times(4)
          .plus(5)
          .sqrt()
          .times(Math.sqrt(5))
          .sub(5)
          .div(2)
          .plus(1)
          .floor();
      }),
    },

    receptors: {
      tick: (diff) => {
        player.distance = Decimal.mul(player.velocity, diff)
          .times(timeReversal.data.timeSpeed.value)
          .plus(player.distance);
        player.velocity = Decimal.mul(basics.data.accel.value, diff)
          .times(timeReversal.data.timeSpeed.value)
          .plus(player.velocity)
          .min(basics.data.maxVelocity.value);
      },

      reset: (id) => {
        if (id >= 0) {
          player.distance = 0;
          player.velocity = 0;
        }
        if (id >= 1) {
          player.rank = 1;
        }
        if (id >= 2) {
          player.tier = hasAch(35) ? 1 : 0;
        }
      },
    },

    actions: {
      rankUp: () => {
        if (Decimal.lt(player.distance, basics.data.rankReq.value)) return;

        player.rank = Decimal.add(player.rank, 1);

        signal("reset", 0);
      },

      tierUp: () => {
        if (Decimal.lt(player.rank, basics.data.tierReq.value)) return;

        player.tier = Decimal.add(player.tier, 1);

        signal("reset", 1);
      },
    },
  }
);

export function hasRank(n: DecimalSource) {
  return Decimal.gte(player.rank, n);
}

export function hasTier(n: DecimalSource) {
  return Decimal.gte(player.tier, n);
}
