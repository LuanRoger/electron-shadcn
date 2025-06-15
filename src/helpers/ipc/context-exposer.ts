import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { exposeTransactionContext } from "./transaction/transaction-context";

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  exposeTransactionContext();
}
