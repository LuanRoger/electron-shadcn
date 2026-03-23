import { os } from "@orpc/server";
import {
  getKeybinds as getKeybindsFromMain,
  setKeybind as setKeybindInMain,
  setKeybinds as setKeybindsInMain,
} from "../../main/keyboard";
import { setKeybindInputSchema, setKeybindsInputSchema } from "./schemas";

export const getKeybinds = os.handler(() => {
  return getKeybindsFromMain();
});

export const setKeybind = os
  .input(setKeybindInputSchema)
  .handler(({ input }) => {
    setKeybindInMain(input.action, input.accelerator);
    return getKeybindsFromMain();
  });

export const setKeybinds = os
  .input(setKeybindsInputSchema)
  .handler(({ input }) => {
    setKeybindsInMain(input);
    return getKeybindsFromMain();
  });
