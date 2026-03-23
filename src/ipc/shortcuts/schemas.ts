import z from "zod";

export const setKeybindInputSchema = z.object({
  action: z.enum(["quit", "reset"]),
  accelerator: z.string(),
});

export const setKeybindsInputSchema = z.object({
  quit: z.string().optional(),
  reset: z.string().optional(),
});
