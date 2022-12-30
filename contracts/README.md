
## Concepts covered in this example:
* [How to setup your environment.](#setting-up-the-environment)
* [How to emit events from a contract.](#creating-and-emitting-events)
* [How to write a test asserting the events were emitted.](#testing-the-events-were-emitted)
* [How to add debug logging to your contract.](#do-logging-in-your-contract)
* [How to store custom data in `ink!` storage.](#store-custom-data-in-your-contract)
* [How to instantiate another contract in the constructor](#instantiate-another-contract-in-constructor)
* [How to transfer tokens as part of a contract call.](#transfer-tokens-as-part-of-a-contract-call)
* [How to unit test a smart contract.](#unit-test-a-contract)
* [How to terminate a contract and what does it mean.](#and-why-to-terminate-a-contract)
* [When to use `panic!`/`assert!` and when return a `Result`.](#panic-and-when-to-return-a-result)
* [What are selectors and how to use them.](#call-another-contract-and-handle-the-response)
* [How to call another contract and handle the response.](#call-another-contract-and-handle-the-response)
* [How to build a contract and optimize it.](#build-your-local-contract-with-optimizations)
* [How to deploy a contract using Contracts UI. And interact with it.](#deploy-a-contract-using-contracts-ui)
* [How to deploy a contract to custom environment.](#deploying-example-contracts-using-scripts)
* Various comments through the code of the contract that try to cover basic ink!-specific constructs.


Let's start.. 

## Setting up the environment

To set up the environment before, please follow the guide from [our documentation](https://docs.alephzero.org/aleph-zero/build/installing-required-tools).

## Example contracts

This repository contains two example smart contracts:
* `/bulletin_board` - a smart contract that allows for posting bulletins with text (one per calling account).
* `/highlighted_posts` - tracks posts that have been highlighted by the bulletin board.

### Building

#### Native

You can build each of the contracts by executing
```shell
cargo contract build --release
```

#### Docker

If you don't want to worry about downloading and installing proper dependencies, you can follow instructions in our ink! compiler repository https://github.com/Cardinal-Cryptography/ink-compiler.

-------------

In respective root folders (`/bulletin_board` and `highlighted_posts`). Verify that the build is successful and there are (among others) three additional files in `<example_contract>/target/ink` directory:
* `metadata.json` -- contains information about the contract's ABI and types.
* `*.wasm` -- the actual logic of the contract compiled into WASM code.
* `*.contract` -- the two above bundled up.

Note the lack of `+nightly`, in the above command, which is suggested in most guides - that's b/c we've specified the version of toolchain being used in the `rust-toolchain` files.

### Deploying

Tutorial below will explain how to develop and test smart contracts using either the local Aleph Zero network or already-existing one, here we will be using our [Testnet](https://test.azero.dev/).

#### Prerequisities for interacting with Aleph Zero Testnet

1. Install PolkadotJS browser extension.
2. Create new account.
3. Fund the account via [Aleph Zero Testnet faucet](https://faucet.test.azero.dev/).

#### Prerequisities for interacting with Local Node

1. Spin up the local network - follow the [official Aleph Zero guide](https://github.com/Cardinal-Cryptography/aleph-node#local-network).
2. Import Alice's key to PolkadotJS browser extension.
    * Open up the PolkadotJS extension, click on the plus sign and _Import account from pre-existing seed_
    * For local Aleph Zero network, we will use one of the pre-funded accounts: Alice. In the _Existing 12 or 24-word mnemonic seed_ paste in the following `0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a`.
    * Give it a descriptive name and save. 

#### Deploy to Contracts UI

1. Go to https://contracts-ui.substrate.io
2. Choose which network you want to deploy to:
    * you can use Aleph Zero Testnet, or
    * Local Node
3. Click on **Add New Contract**
4. Here you have to options:
    * Either use an existing contract code (you will need to pass in a code hash of the contract you want to interact with), or
    * Upload a contract from your machine
5. After adding a contract it will appear on the left, under **Your contracts**. Click on it and you should be presented with a page where you can interact with it - call its methods.

For more information about the **Contracts UI**  consult the official documentation: https://use.ink/getting-started/deploy-your-contract


### Deploying example contracts with Contracts UI

1. Go to https://contracts-ui.substrate.io
2. Choose the network you want to deploy to.
3. Click **Add New Contract** and then **Upload New Contract Code**.
4. Choose an account that you own on that network with enough balance to cover the test.
5. Click on **Upload Contract Bundle** and navigate to `highlighted_posts/target/ink` and choose `highlighted_posts.contract`.
6. Press **Next** and then again **Next** and **Upload and instantiate**.
7. Sign the transaction using your account.
8. In the newly opened page, you will see _You instantiated this contract `<contract address>` from `contract name`_. Click on the **contract name** and copy the last hash from the address bar: `https://contracts-ui.substrate.io/instantiate/<hash>` -- this is the code hash of your freshly uploaded contract. Note that it's not an _instance_ of it, just an address where your contract's code lives.
9. Repeat steps 3-5 for `bulletin_board` contract.
10. When on **Upload and Instantiate Contract** page, choose **pricePerBlockListing** - this will define how much tokens the caller has to transfer. Change **highlightedPostsBoard** value to the code hash from step **8**. Click **Next** and upload the second contract.

You have both contracts deployed now. You can play with them, see how they interact with each other, notice how **Contracts UI** will do a _dry-run_ of your calls and show you the expected results even before you decide to do any transaction.


### Deploying example contracts using scripts

In `../scripts` folder you will find `deploy_local.sh` and `deploy_Testnet.sh` script files that will deploy the examplary project to local or Testnet networks. After the deployment you should see contracts' code hashes and addresses printed to your terminal. You can use them with polkadot.js explorer to interact with the contracts.

Note that for local network there can be only one deployment of the same code (`cargo contract upload`) as subsequent executions would duplicate the code on chain.

For Testnet (or any other network for that matter), you will have to fill in the variables under `./scripts/env/Testnet`.

## How to ...

### Emit events and verify in tests you did

#### Creating and emitting events
See `lib.rs` for `#[ink(event)]` on how to define it and [`fn emit_event`](./bulletin_board/lib.rs#L471) to see how to emit it.

> Thing to note here is the custom `emit_event` function - you may have seen in official ink! documentation that events are emitted via `self::env().emit_event(my_event)` calls. The "official" version works when there is only one contract emitting events on our _execution path_. If our contract emits events and, during execution, calls another contract that emits events AND we have that contract as a dependency, we will have two unreleated event families (from two different contracts) and the compiler will fail to resolve type boundaries correctly. For more details, see comments on [`fn emit_event`](./bulletin_board/lib.rs#L471).

#### Testing the events were emitted

In `lib.rs` look for calls to [`recorded_events()`](./bulletin_board/lib.rs#L588), to collect the emitted events, and [`assert_expected_*_event`](./bulletin_board/lib.rs#L589) to test whether we got the expected ones.

### Do logging in your contract

In `lib.rs` see [invocation](./bulletin_board/lib.rs#L242) of `ink_env::debug_println!` - this will produce a log message when ran in test. To verify, run [`event_on_post`](./bulletin_board/lib.rs#L583) test and observe the following log:
```shell
running 1 test
`AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])` wants to create a post that expires after `100` blocks with the text `"Text"`
test bulletin_board::tests::event_on_post ... ok
```

If you build your contract in debug mode (i.e. without `--release` flag), then the debugging prints will also be visible in **Contracts UI** frontend.

### Store custom data in your contract

Derive (or implement manually) `SpreadLayout` and `PackedLayout` for the structs you want to store as part of the contract. See [`Bulletin`](./bulletin_board/lib.rs#L110)struct and its [usage](./bulletin_board/lib.rs#L137) in the `Mapping` of the `BulletinBoard` contract state.

### Instantiate another contract in constructor

All you need is a code hash of the other contract you want to instantiate. See an example of that in [`bulletin_board/lib.rs#new`](./bulletin_board/lib.rs#L159).

### Transfer tokens as part of a contract call

If you want your method to accept token transfer, you need to tag it with `payable` keyword: `#[ink(payable)]`. See [`BulletinBoard::post`](./bulletin_board/lib.rs#L231) for an example.

For an example on how to do a cross-contract call _and_ transfer tokens, see [`highlight_post`](./bulletin_board/lib.rs#L415).

### Unit test a contract

See [`bulletin_board::tests`](./bulletin_board/lib.rs#L502) for various tests, including mocking the blockchain environment - setting caller, token balance, etc.

### Terminate a contract (and why)

If you want to delete an instance of the contract because it's incorrect, no longer needed (and we want to free the storage) or for any other reason we can do it by _terminating_ a contract.

To delete an instance of the contract, call `self.env().terminate_contract(<beneficiary>)`. You can choose the _beneficiary_ that will receive tokens that the contract owns. For the example, see [`terminate_contract`](./bulletin_board/lib.rs#L323).

### `panic!` and when to return a `Result`

To terminate your contract execution you can either panic (via `panic!`, `assert`, `require!`, etc.) or return a rust `Result` type (with `Err` variant) from your method. Both will signal to the caller that the call failed. Both will revert any changes to the state of _the current_ contract.

The main difference between the two is that `panic!` returns [`ink_env::error::Error::CalleeTrapped`](https://docs.rs/ink_env/3.4.0/ink_env/enum.Error.html#variant.CalleeTrapped), which carries no additional context, while your custom error (returned via `Result::Err(MyError)`) does. It makes it easier for the caller to handle the failure (if it knows the reason, it can decide what to do) and also provides more helpfull messages in UI clients since the custom error can be shown to the user.

### Call another contract and handle the response

Every contract _instance_ is stored under an address of type `AccountId`. To call contract's method you need to know:
* its address (`AccountId`)
* a method we want to call - _selector_ (four bytes identifier of the method)
* set of arguments and their types
* return type

Calling another contract can be currently made in two ways:

1) Building the call manually. An example of that is [`highlight_post`](./bulletin_board/lib.rs#L415). Here, we set every piece of the call by hand and we have no help from the compiler (to tell us whether we use correct arguments or if the return type is valid). This manual approach gives contract author access to ink!-level [errors](https://docs.rs/ink_env/3.4.0/ink_env/enum.Error.html) which gives an option to recover from the low-level failures.
2) Using the macro-generated `*Ref` pattern. An example of that is [`delete_highlight`](./bulletin_board/lib.rs#L487). This approach is type-safe but doesn't allow for transferring tokens with the call. At least not currently.

Both approaches, if done correctly, provide a typed access to another contract.

### Build your local contract with optimizations

First, make sure you have the necessary tools installed - see [setup](#setup). 

Now, call 
```shell
cargo contract build
```
This will build your contract _without_ any optimizations, in **DEBUG** mode. This is useful during development since the resulting Wasm file contains debug symbols.

For production use, always build in **RELEASE** mode, which will shrink the size of the resulting Wasm significantly: 
```shell 
cargo contract build --release
```

Additionally, you can choose how many optimization passes the `cargo contract build` does on your contract. For more information run
```shell
cargo contract build --help
```
and look at `--optimization-passes` section.

## Concepts NOT covered in this example

### Usage of OpenBrush library

[OpenBrush](https://openbrush.io/) is a set of libraries created by Supercolony (a very competent team that works with the Parity team on ink!) that tries to cover the places where ink! may be too "raw" for some developers. You may think about it as [OpenZeppelin in ink!](https://medium.com/supercolony/ink-has-most-of-the-features-required-for-usage-however-the-usability-of-ink-is-low-95f4bc974e22).

This is a wide set of tools which, in some cases (like contract traits and other macros), replaces native ink! tooling. This particular template is meant to help developers bootstrap with ink! and leaves the extension to the developer.
