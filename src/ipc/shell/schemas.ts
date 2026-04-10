import z from "zod";

export const openExternalLinkInputSchema = z.object({
  url: z.url(),
});
