import { createConnection, NetConnectOpts, Socket } from "net";
import split2 from "split2";

type Options = NetConnectOpts & {
  connectTimeout?: number;
};

type OnDataCallback = (data: string) => void;

export class TcpTransportClient {
  private callback: OnDataCallback = () => undefined;
  private connecting?: Promise<Socket>;

  constructor(private readonly opts: Options) {}

  private connect(): Promise<Socket> {
    if (!this.connecting) {
      this.connecting = new Promise<Socket>((resolve, reject) => {
        const socket = createConnection(this.opts);
        const timer = setTimeout(() => {
          socket.destroy();
          reject(new Error("timeout"));
        }, this.opts.connectTimeout ?? 30000);
        socket.once("connect", () => {
          clearTimeout(timer);
          resolve(socket);
        });
        socket.on("error", () => undefined);
        socket.on("close", () => this.connecting = undefined);
        socket.pipe(split2("\n")).on("data", (line: string) => this.callback(line));
      });
    }

    return this.connecting;
  }

  public onData(callback: OnDataCallback): void {
    this.callback = callback;
  }

  public async sendData(data: string): Promise<void> {
    const socket = await this.connect();
    socket.write(`${data}\n`);
  }

  public close() {
    if (!this.connecting) {
      return;
    }

    this.connecting
      .then((socket) => socket.destroy())
      .catch(() => undefined);
  }
}
