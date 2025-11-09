import { RPCHandler } from "@orpc/server/message-port";
import { onError } from "@orpc/server";
import { router } from "./router";

export const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
