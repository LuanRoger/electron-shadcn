import { ClientContext, createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";
import { router } from "./router";
import { RouterClient } from "@orpc/server";

type RPCClient = RouterClient<typeof router>;

class IPCManager {
  private readonly clientPort: MessagePort;
  private readonly serverPort: MessagePort;

  private readonly rpcLink: RPCLink<ClientContext>;

  public readonly client: RPCClient;

  private initialized: boolean = false;

  constructor() {
    const { port1: clientChannelPort, port2: serverChannelPort } =
      new MessageChannel();
    this.clientPort = clientChannelPort;
    this.serverPort = serverChannelPort;

    this.rpcLink = new RPCLink({
      port: this.clientPort,
    });
    this.client = createORPCClient(this.rpcLink);
  }

  public initialize() {
    if (this.initialized) {
      return;
    }

    this.clientPort.start();

    window.postMessage("start-orpc-client", "*", [this.serverPort]);
    this.initialized = true;
  }
}

export const ipc = new IPCManager();
ipc.initialize();
