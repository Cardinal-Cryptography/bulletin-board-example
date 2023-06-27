This repository will serve dApp developers, interested in developing for Aleph Zero network, to boostrap their work. It will include:
* an example set of smart contracts, showcasing all basic building blocks required to build a dApp
* accompanying frontend, together with Aleph Zero branding, for interacting with the contracts
* integration with the PolkadotJS signer extension


## How to run locally

### Prerequisities

1. Rust in version 1.69.0 with the `nightly-2023-02-07` toolchain.
2. `substrate-contracts-node` version [`v0.26.0`](https://github.com/paritytech/substrate-contracts-node/releases/tag/v0.26.0).
3. `cargo-contract` version [`3.0.1`](https://github.com/paritytech/cargo-contract/releases/tag/v3.0.1).

**To install Rust**, run:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

This will install `rustup`, the Rust version and toolchain management tool. Next, use it to install Rust and the appropriate toolchain:

```bash
rustup install 1.69.0
rustup install nightly-2023-02-07-x86_64-unknown-linux-gnu
```

**To install the `substrate-contracts-node`**, simply download it from [the release page](https://github.com/paritytech/substrate-contracts-node/releases/tag/v0.26.0), unpack the archive and put the binary on your path (remember to reload the shell for this to take effect).

**To install cargo contract**, run:
```bash
cargo install --force --locked cargo-contract --version 3.0.1
```

You can verify your versions using:
```bash
rustup show
substrate-contracts-node --version
cargo contract --version
```

### Running chain

In the root directory of the project, run `make chain-start`. To stop the chain, just exit the process in your terminal.

To clean the chain's run `make chain-clean`. This will remove chain's database files (like blocks and contracts).

To restart the chain (and purge the state) run `make chain-restart`.

By default, node will bind its websocket endpoint to port **9944**. Make sure that the chain is running WS on port 9944. In the logs, look for:
```sh
2023-01-10 19:23:40.475  INFO main sc_rpc_server: Running JSON-RPC HTTP server: addr=127.0.0.1:9933, allowed origins=None
2023-01-10 19:23:40.475  INFO main sc_rpc_server: Running JSON-RPC WS server: addr=127.0.0.1:9944, allowed origins=None
```
If it bound to a different port your frontend instance will not connect properly - it tries to connect to the 9944 port. In that case, either make sure there are no other `substrate-contracts-node` running (by killing them with `make chain-stop`) or change the port in the frontend app.

### Building contracts

In the `/contracts` directory run `make build-all` to build both contracts.

### Deploying contracts

In the root directory, run `make setup`. This will:
* deploy both contracts to the local chain
* instantiate them
* record their addresses
* update the addresses and contracts' metadata files in the frontend directory

If you need to upload the contracts many times, you have two options:
* run the `make chain-restart` command, which will remove the old contracts,
* set the `BULLETIN_BOARD_VERSION` variable to different two-digit numbers with each run, which will allow you to upload different instances of the same contract.

Option 1 is the recommended one for most use cases.

### Running the frontend

In the `/frontend` directory, run `export REACT_APP_PROVIDER_URL=ws://localhost:9944 && npm start`. This should open a new tab in your default browser that connects to your local chain.

### Working with the polkadot.js wallet extension

To sign transactions, we will be using the [polkadot extension](https://polkadot.js.org/extension/). Follow the instructions about how to install it in the official documentation.

`substrate-contracts-node` ships with bunch of pre-funded accounts - we need to import them into the extension:
1. Open the browser extension modal.
2. Click on the **+** icon.
3. Then **Import account from pre-existing seed**.
4. In the **EXISTING 12 OR 24-WORD MNEOMNIC SEED** form add `bottom drive obey lake curtain smoke basket hold race lonely fit walk` -- this it the seed for the default accounts. You can find it on https://docs.substrate.io/reference/command-line-tools/subkey/#subkey-generate-node-key .
5. Click **ADVANCED** and use one of the derivation paths:
* `//Bob//stash`
* `//Charlie//stash`
* `//Dave//stash`
* `//Eve//stash`
* `//Ferdie//stash`
6. Finish the account setup.

Now, you can use the newly-added account with the example frontend.
