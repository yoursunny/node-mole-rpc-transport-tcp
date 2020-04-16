import { createServer, ListenOptions, Server } from "net";
import split2 from "split2";

type Options = ListenOptions;

type OnDataCallback = (data: string|undefined) => Promise<string>;

export class TcpTransportServer {
  private callback: OnDataCallback = () => Promise.reject(new Error("no callback"));
  private readonly server: Server;

  constructor(private readonly opts: Options) {
    this.server = createServer();
    this.server.listen(this.opts);
    this.server.on("connection", (socket) => {
      socket.pipe(split2("\n")).on("data", (line: string) => {
        this.callback(line)
          .then((reply) => {
            if (typeof reply === "string") {
              socket.write(`${reply}\n`);
            }
          });
      });
      socket.on("error", () => socket.destroy());
    });
  }

  public async onData(callback: OnDataCallback): Promise<void> {
    this.callback = callback;
  }

  public close(): Promise<void> {
    return new Promise<void>((resolve) => this.server.close(() => resolve()));
  }
}
