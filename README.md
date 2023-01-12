This repository will serve dApp developers, interested in developing for Aleph Zero network, to boostrap their work. It will include:
* an example set of smart contracts, showcasing all basic building blocks required to build a dApp
* accompanying fronted end, together with Aleph Zero branding, for interacting with the contracts
* integration with PolkadotJS signer extension


## How to run locally

### Prerequisities

1. `substrate-contracts-node` version [`v0.22.1`](https://github.com/paritytech/substrate-contracts-node/releases/tag/v0.22.1). Later releases are compatible with `pallet-contracts` version `0.9.34` which is not the same one as Aleph Zero Testnet.
2. `cargo-contract` version [`2.0.0-beta.1`](https://github.com/paritytech/cargo-contract/releases/tag/v2.0.0-beta.1). Later releases are compatible with `pallet-contracts` version `0.9.34` which is not the same one as Aleph Zero Testnet.

### Running chain

In the root directory of the project, run `make chain-start`. To stop the chain, just exit the process in your terminal.

To clean the chain's run `make chain-clean`. This will remove chain's database files (like blocks and contracts).

To restart the chain (and purge the state) run `make chain-restart`.

By default, node will bind its websocket endpoint to port **9944**. Make sure that the chain is running WS at port 9944 .In the logs, look for:
```sh
2023-01-10 19:23:40.475  INFO main sc_rpc_server: Running JSON-RPC HTTP server: addr=127.0.0.1:9933, allowed origins=None
2023-01-10 19:23:40.475  INFO main sc_rpc_server: Running JSON-RPC WS server: addr=127.0.0.1:9944, allowed origins=None
```
If it bound to a different port your frontend instance will not connect properly - it tries to bind to 9944 port. In that case, either make sure there are no other `substrate-contracts-node` running (by killing them with `make chain-stop`) or change the port in the frontend app.

### Building contracts

In `/contracts` directory run `make build-all` to build both contrats.

### Deploying contracts

In the root directory, run `make setup`. This will:
* deploy both contracts to the local chain
* instantiate them
* record their addresses
* update addresses and contracts' metadata files in the frontend directory

### Running frontend

In `/frontend` directory, run `npm start`. This should open a new tab in your default browser that connects to your local chain.
