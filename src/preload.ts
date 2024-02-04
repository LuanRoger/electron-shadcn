import { exposeThemeContext, exposeWindowContext } from "./helpers/ipc/context-isolations";

exposeWindowContext();
exposeThemeContext();