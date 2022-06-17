import { player } from "@/main";
import features, { addFeature, signal } from "@/util/feature";
import Decimal, { DecimalSource } from "break_eternity.js";
import { ref } from "vue";
import { rockets } from "../rockets/rockets";

export type RTDesc = Record<number, string>;

export const RANK_DESCS: RTDesc = {
  2: "increase Maximum Velocity by 1 m/s.",
  3: "increase Acceleration and Maximum Velocity by 10% per Rank.",
  4: "double Acceleration and decrease the Rank requirement base by 0.3.",
  5: "triple Acceleration and Maximum Velocity.",
  6: "double Accleration and Maximum Velocity, and decrease the Rank requirement base by 0.25.",
  7: "increase Maximum Velocity by 10% per Rank.",
  8: "increase Acceleration by 10% per Rank.",
  10: "increase Acceleration by 50%.",
  15: "double Acceleration",
};

export const TIER_DESCS: RTDesc = {
  1: "increase Acceleration by 0.03 m/s^2, and increase Maximum Velocity by 20%.",
  2: "double Acceleration and quintuple Maximum Velocity if you are at least Rank 3.",
  3: "double Maximum Velocity, and halve Rank requirement per Tier.",
  4: "double Acceleration and Maximum Velocity per Tier.",
  5: "double Acceleration and Maximum Velocity",
  6: "triple Acceleration.",
};

interface BasicData {
  rank3Reward: DecimalSource;
  tier3Reward: DecimalSource;
  preRocketAccel: DecimalSource;
  preRocketMaxVelocity: DecimalSource;
  accel: DecimalSource;
  maxVelocity: DecimalSource;
  rankReq: DecimalSource;
  tierReq: DecimalSource;
}

interface BasicActions {
  rankUp: () => void;
  tierUp: () => void;
}

addFeature<BasicData, BasicActions>("basics", 0, {
  unl: {
    reached: () => true,
    desc: () => "",
  },

  data: {
    rank3Reward: 1,
    tier3Reward: 1,
    preRocketAccel: 0,
    preRocketMaxVelocity: 0,
    accel: 0,
    maxVelocity: 0,
    rankReq: "Infinity",
    tierReq: "Infinity",
  },

  values: {
    rank3Reward: () => {
      return Decimal.pow(1.1, player.rank);
    },

    tier3Reward: () => {
      return Decimal.pow(2, player.tier);
    },

    preRocketAccel: () => {
      let acc: DecimalSource = 0.05;

      if (hasTier(1)) acc += 0.03;

      if (hasRank(3)) acc = Decimal.mul(acc, basics.value.data.rank3Reward);
      if (hasRank(4)) acc = Decimal.mul(acc, 2);
      if (hasRank(5)) acc = Decimal.mul(acc, 3);
      if (hasRank(6)) acc = Decimal.mul(acc, 2);
      if (hasRank(8)) acc = Decimal.mul(acc, basics.value.data.rank3Reward);
      if (hasRank(10)) acc = Decimal.mul(acc, 1.5);
      if (hasRank(15)) acc = Decimal.mul(acc, 2);

      if (hasTier(2) && hasRank(3)) acc = Decimal.mul(acc, 2);
      if (hasTier(4)) acc = Decimal.mul(acc, basics.value.data.tier3Reward);
      if (hasTier(5)) acc = Decimal.mul(acc, 2);
      if (hasTier(6)) acc = Decimal.mul(acc, 3);

      return acc;
    },

    preRocketMaxVelocity: () => {
      let vel: DecimalSource = 1;

      if (hasRank(2)) vel++;

      if (hasRank(3)) vel = Decimal.mul(vel, basics.value.data.rank3Reward);
      if (hasRank(5)) vel = Decimal.mul(vel, 3);
      if (hasRank(6)) vel = Decimal.mul(vel, 2);
      if (hasRank(7)) vel = Decimal.mul(vel, basics.value.data.rank3Reward);

      if (hasTier(1)) vel = Decimal.mul(vel, 1.2);
      if (hasTier(2) && hasRank(3)) vel = Decimal.mul(vel, 5);
      if (hasTier(3)) vel = Decimal.mul(vel, 2);
      if (hasTier(4)) vel = Decimal.mul(vel, basics.value.data.tier3Reward);
      if (hasTier(5)) vel = Decimal.mul(vel, 2);

      return vel;
    },

    accel: () =>
      Decimal.mul(basics.value.data.preRocketAccel, rockets.value.data.accMult),

    maxVelocity: () =>
      Decimal.mul(
        basics.value.data.preRocketMaxVelocity,
        rockets.value.data.maxVelMult
      ),

    rankReq: () => {
      let base = 2;

      if (hasRank(4)) base -= 0.3;
      if (hasRank(6)) base -= 0.25;

      let req = Decimal.pow(base, Decimal.sub(player.rank, 1).pow(2)).times(10);

      if (hasTier(3)) req = Decimal.div(req, basics.value.data.tier3Reward);

      return req;
    },

    tierReq: () => {
      return Decimal.pow(player.tier, 2)
        .div(5)
        .plus(player.tier)
        .plus(3)
        .floor();
    },
  },

  receptors: {
    tick: (diff) => {
      player.velocity = Decimal.mul(basics.value.data.accel, diff)
        .plus(player.velocity)
        .min(basics.value.data.maxVelocity);
      player.distance = Decimal.mul(player.velocity, diff).plus(
        player.distance
      );
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
        player.tier = 0;
      }
    },
  },

  actions: {
    rankUp: () => {
      if (Decimal.lt(player.distance, basics.value.values.rankReq())) return;

      player.rank = Decimal.add(player.rank, 1);

      signal("reset", 0);
    },

    tierUp: () => {
      if (Decimal.lt(player.rank, basics.value.values.tierReq())) return;

      player.tier = Decimal.add(player.tier, 1);

      signal("reset", 1);
    },
  },

  deferred: ["accel", "maxVelocity"],
});

export const basics = ref(features.value.basics);

export function hasRank(n: DecimalSource) {
  return Decimal.gte(player.rank, n);
}

export function hasTier(n: DecimalSource) {
  return Decimal.gte(player.tier, n);
}
