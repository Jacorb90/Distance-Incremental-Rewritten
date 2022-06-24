import { player } from "@/main";
import { addFeature, Feature, signal } from "@/util/feature";
import { format, formatWhole } from "@/util/format";
import { computed, ComputedRef } from "@vue/reactivity";
import Decimal, { DecimalSource } from "break_eternity.js";
import { hasAch } from "../achs/achs";
import { rocketFuel } from "../rocketFuel/rocketFuel";
import { rockets } from "../rockets/rockets";

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
  15: computed(() => `double Acceleration.`),
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
};

interface BasicData {
  rank3Reward: Decimal;
  tier3Reward: Decimal;
  preRocketAccel: DecimalSource;
  preRocketMaxVelocity: DecimalSource;
  accel: Decimal;
  maxVelocity: Decimal;
  rankReq: Decimal;
  tierReq: Decimal;
}

interface BasicActions {
  rankUp: () => void;
  tierUp: () => void;
}

export const basics: Feature<BasicData, BasicActions> = addFeature(
  "basics",
  1,
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
        if (hasRank(15)) acc = Decimal.mul(acc, 2);

        if (hasTier(2) && hasRank(3)) acc = Decimal.mul(acc, 2);
        if (hasTier(4)) acc = Decimal.mul(acc, basics.data.tier3Reward.value);
        if (hasTier(5)) acc = Decimal.mul(acc, 2);
        if (hasTier(6)) acc = Decimal.mul(acc, 3);

        if (hasAch(12)) acc = Decimal.mul(acc, 1.05);
        if (hasAch(14)) acc = Decimal.mul(acc, 1.15);
        if (hasAch(22)) acc = Decimal.mul(acc, 1.06);
        if (hasAch(32)) acc = Decimal.mul(acc, 1.07);

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

        if (hasTier(1)) vel = Decimal.mul(vel, 1.2);
        if (hasTier(2) && hasRank(3)) vel = Decimal.mul(vel, 5);
        if (hasTier(3)) vel = Decimal.mul(vel, 2);
        if (hasTier(4)) vel = Decimal.mul(vel, basics.data.tier3Reward.value);
        if (hasTier(5)) vel = Decimal.mul(vel, 2);

        if (hasAch(14)) vel = Decimal.mul(vel, 1.15);
        if (hasAch(21)) vel = Decimal.mul(vel, 1.05);

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
      rankReq: computed(() => {
        let base = 2;

        if (hasRank(4)) base -= 0.3;
        if (hasRank(6)) base -= 0.25;

        let div = 1;

        if (hasTier(7)) div += 0.05;

        let req = Decimal.pow(
          base,
          Decimal.sub(player.rank, 1).div(div).pow(2)
        ).times(10);

        if (hasTier(3)) req = Decimal.div(req, basics.data.tier3Reward.value);

        req = Decimal.div(req, rocketFuel.data.eff2.value);

        if (hasAch(23)) req = Decimal.div(req, 1.05);

        return req;
      }),
      tierReq: computed(() => {
        let req = Decimal.pow(player.tier, 2).div(5).plus(player.tier).plus(3);

        if (hasAch(15)) req = req.sub(1);
        if (hasAch(25)) req = req.sub(1);

        return req.floor();
      }),
    },

    receptors: {
      tick: (diff) => {
        player.distance = Decimal.mul(player.velocity, diff).plus(
          player.distance
        );
        player.velocity = Decimal.mul(basics.data.accel.value, diff)
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
