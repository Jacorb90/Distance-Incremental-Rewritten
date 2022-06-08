import { save } from "@/App.vue";
import player, { metaSave } from "@/main";
import { saveGame } from "@/saveload";
import { ref, StyleValue } from "vue";

interface OptionData {
  text: string | (() => string);
  action: () => void;
  style?: StyleValue;
}

const loadModalOpen = ref(false);

// eslint-disable-next-line
const OPTION_DATA: {SAVING: OptionData[], OTHER: OptionData[]} = {
  SAVING: [
    {
      text: "Save",
      action: save.value,
    },
    {
      text: "Load",
      action: () => (loadModalOpen.value = true),
    },
    {
      text: "Import",
      action: () => {
        const data = prompt("Paste your save data here: ");

        if (data !== null && metaSave.value !== undefined) {
          try {
            metaSave.value.saves[metaSave.value.currentSave] = JSON.parse(
              atob(data)
            );
            player.value = metaSave.value.saves[metaSave.value.currentSave];

            saveGame(metaSave.value);
          } catch (e) {
            alert(
              "It seems as though your save cannot be loaded! Please check the console for details!"
            );
            throw e;
          }
        }
      },
    },
    /*{
            text: "Export",
            action: () => {
                
            }
        }*/
  ],

  OTHER: [],
};
