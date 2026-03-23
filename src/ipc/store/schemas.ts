import z from "zod";

export const setSettingsInputSchema = z.object({
  accentColor: z.string().optional(),
  allowAutoUpdate: z.boolean().optional(),
  allowNotifications: z.boolean().optional(),
  showDockIcon: z.boolean().optional(),
  showTrayIcon: z.boolean().optional(),
  startMinimized: z.boolean().optional(),
  quitOnWindowClose: z.boolean().optional(),
  theme: z.enum(["system", "light", "dark"]).optional(),
});

export const getSettingInputSchema = z.object({
  key: z.enum([
    "accentColor",
    "allowAutoUpdate",
    "allowNotifications",
    "showDockIcon",
    "showTrayIcon",
    "startMinimized",
    "quitOnWindowClose",
    "theme",
  ]),
});
