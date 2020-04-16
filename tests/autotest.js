const AutoTester = require("mole-rpc-autotester");
const MoleClient = require("mole-rpc/MoleClient.js");
const MoleClientProxified = require("mole-rpc/MoleClientProxified.js");
const MoleServer = require("mole-rpc/MoleServer.js");
const X = require("mole-rpc/X.js");

const { TcpTransportClient, TcpTransportServer } = require("../mod.js");

async function main() {
  const serverTransport = new TcpTransportServer({ port: 13959 });
  const server = new MoleServer({
    transports: [serverTransport],
  });
  const simpleClientTransport = new TcpTransportClient({ port: 13959 });
  const simpleClient = new MoleClient({
    requestTimeout: 1000,
    transport: simpleClientTransport,
  });
  const proxifiedClientTransport = new TcpTransportClient({ port: 13959 });
  const proxifiedClient = new MoleClientProxified({
    requestTimeout: 1000,
    transport: proxifiedClientTransport,
  });

  const autoTester = new AutoTester({
    X,
    server,
    simpleClient,
    proxifiedClient,
  });

  try {
    await autoTester.runAllTests();
  } finally {
    simpleClientTransport.close();
    proxifiedClientTransport.close();
    await serverTransport.close();
  }
}

main().then(console.log, console.error);
