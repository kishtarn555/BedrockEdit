import { world, system } from "@minecraft/server";
import attachScriptEventsWatcher from "./myscriptevents"
import {attachWandListener} from "./tools/wand"
import {attachPickerItemUse} from "./tools/pick"
import renderSelection from "./particle_visualizer"
import attachModalItemUseListeners from "./modals/itemAttachments";
import attachOperatorItemListeners from "./operators/operatorUtil/itemListeners";

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
attachOperatorItemListeners();
attachModalItemUseListeners();