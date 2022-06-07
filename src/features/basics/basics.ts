import player from "@/main";
import { Feature } from "@/util/feature";
import Decimal, { DecimalSource } from "break_eternity.js";
import basicsVue from "./basics.vue";

interface BasicData {
  accel: DecimalSource;
  maxVelocity: DecimalSource;
}

const basics: Feature<BasicData> = {
  data: {
    accel: 0,
    maxVelocity: 0,
  },

  values: {
    accel() {
      return 0.05;
    },
    maxVelocity() {
      return 1;
    },
  },

  receptors: {
    tick: (diff) => {
      if (player.value !== undefined) {
        player.value.velocity = Decimal.mul(basics.data.accel, diff)
          .plus(player.value.velocity)
          .min(basics.data.maxVelocity);
        player.value.distance = Decimal.mul(player.value.velocity, diff).plus(
          player.value.distance
        );
      }
    },
  },

  component: basicsVue,
};

export default basics;
