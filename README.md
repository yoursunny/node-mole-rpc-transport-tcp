# mole-rpc-transport-tcp

[![Build Status](https://travis-ci.com/yoursunny/node-mole-rpc-transport-tcp.svg?branch=master)](https://travis-ci.com/yoursunny/node-mole-rpc-transport-tcp)

TCP transport for [mole-rpc](https://www.npmjs.com/package/mole-rpc).

```js
const MoleClient = require("mole-rpc/MoleClient.js");
const MoleServer = require("mole-rpc/MoleServer.js");
const { TcpTransportClient, TcpTransportServer } = require("node-mole-rpc-transport-tcp");

// create client transport
const clientTransport = new TcpTransportClient({ host: "192.0.2.1", port: 6653 });
// create client
const client = new MoleClient({ transport: clientTransport });
// close client transport
clientTransport.close();

// create server transport
const serverTransport = new TcpTransportClient({ port: 6653 });
// create server
const server = new MoleServer({ transports: [serverTransport] });
// close server transport
await serverTransport.close();
```
