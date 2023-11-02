import { world, system } from "@minecraft/server";
import attachScriptEventsWatcher from "./myscriptevents"
import {attachWandListener} from "./tools/wand"
import {attachPickerItemUse} from "./tools/pick"
import { attachOperatorItemUseListener } from "./operators/attatcher";
import renderSelection from "./particle_visualizer"

const START_TICK = 100;

function mainTick() {
  if (system.currentTick < START_TICK) {
      
    system.run(mainTick);
    return;
  }
  if (system.currentTick % 5 === 0)
    renderSelection();
  system.run(mainTick);
}

system.run(mainTick);
//attachScriptEventsWatcher();
attachPickerItemUse();
attachWandListener();
attachOperatorItemUseListener();