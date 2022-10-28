
## Concepts covered in this example:
* [How to setup your environment.](#setting-up-the-environment)
* [How to emit events from a contract.](#creating-and-emitting-events)
* [How to write a test asserting the events were emitted.](#testing-the-events-were-emitted)
* [How to add debug logging to your contract.](#do-logging-in-your-contract)
* [How to store custom data in `ink!` storage.](#store-custom-data-in-your-contract)
* [How to transfer tokens as part of a contract call.](#transfer-tokens-as-part-of-a-contract-call)
* [How to unit test a smart contract.](#unit-test-a-contract)
* [How to terminate a contract and what does it mean.](#and-why-to-terminate-a-contract)
* [When to use `panic!`/`assert!` and when return a `Result`.](#panic-and-when-to-return-a-result)
* [What are selectors and how to use them.](#call-another-contract-and-handle-the-response)
* [How to call another contract and handle the response.](#call-another-contract-and-handle-the-response)
* [How to test cross-contract calls.](#test-a-cross-contract-call)
* [How to build a contract and optimize it.](#build-your-local-contract-with-optimizations)
* [How to deploy a contract using Contracts UI. And interact with it.](#deploy-a-contract-using-contracts-ui)
* How to deploy a contract to custom environment.
* Various comments through the code of the contract that try to cover basic ink!-specific constructs.


Let's start.. 

## Setting up the environment

## How to ...

### emit events and verify in tests you did

#### Creating and emitting events
See `lib.rs` for `#[ink(event)]` on how to define it and [`fn emit_event`](./bulletin_board/lib.rs#L409) to see how to emit it.

> Thing to note here is the custom `emit_event` function - you may have seen in official ink! documentation that events are emitted via `self::env().emit_event(my_event)` calls. The "official" version works when there is only one contract emitting events on our _execution path_. If our contract emits events and, during execution, calls another contract that emits events AND we have that contract as a dependency, we will have two unreleated event families (from two different contracts) and the compiler will fail to resolve type boundaries correctly. For more details, see comments on [`fn emit_event`](./bulletin_board/lib.rs#L409).

#### Testing the events were emitted

In `lib.rs` look for calls to [`recorded_events()`](./bulletin_board/lib.rs#L526), to collect the emitted events, and [`assert_expected_*_event`](./bulletin_board/lib.rs#L535) to test whether we got the expected ones.

### do logging in your contract

In `lib.rs` see [invocation](./bulletin_board/lib.rs#L194) of `ink_env::debug_println!` - this will produce a log message when ran in test. To verify, run [`event_on_post`](./bulletin_board/lib.rs#L521) test and observe the following log:
```shell
running 1 test
`AccountId([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])` wants to create a post that expires after `100` blocks with the text `"Text"`
test bulletin_board::tests::event_on_post ... ok
```

### store custom data in your contract

Derive (or implement manually) `SpreadLayout` and `PackedLayout` for the structs you want to store as part of the contract. See [`Bulletin`](./bulletin_board/lib.rs#L98) struct and its [usage](./bulletin_board/lib.rs#L124) in the `Mapping` of the `BulletinBoard` contract state.

### transfer tokens as part of a contract call

If you want your method to accept token transfer, you need to tag it with `payable` keyword: `#[ink(payable)]`. See [`BulletinBoard::post`](./bulletin_board/lib.rs#L183) for an example.

For an example on how to do a cross-contract call _and_ transfer tokens, see [`highlight_post`](./bulletin_board/lib.rs#L358).

### unit test a contract

See [`bulletin_board::tests`](./bulletin_board/lib.rs#L439) for various tests, including mocking the blockchain environment - setting caller, token balance, etc.

### (and why) to terminate a contract

If you want to delete an instance of the contract because it's incorrect, no longer needed (and we want to free the storage) or for any other reason we can do it by _terminating_ a contract.

To delete an instance of the contract, call `self.env().terminate_contract(<beneficiar>)`. You can choose the _beneficiary_ that will receive tokens that the contract owns. For the example, see [`terminate_contract`](./bulletin_board/lib.rs#L269).

### `panic!` and when to return a `Result`

To terminate your contract execution you can either panic (via `panic!`, `assert`, `require!`, etc.) or return a rust `Result` type from your method. Both will signal to the caller that the call failed. Both will revert any changes to the state of _your_ contract.

The main difference between the two is that `panic!` returns [`ink_env::error::Error::CalleeTrapped`](https://docs.rs/ink_env/3.4.0/ink_env/enum.Error.html#variant.CalleeTrapped), which carries no additional context, while your custom error (returned via `Result::Err(MyError)`) does. It makes it easier for the caller to handle the failure (if he knows the reason he can decide what to do with it) and also provides more helpfull messages in UI clients since the custom error can be shown to the user.

### call another contract and handle the response

Every contract _instance_ is stored under an address of type `AccountId`. To call contract's endpoint you need to know:
* its address (`AccountId`)
* an endpoint we want to call - _selector_ (four bytes identifier of the endpoint)
* set of arguments and their types
* return type

Calling another contract can be currently made in two ways:

1) Building the call manually. An example of that is [`highlight_post`](./bulletin_board/lib.rs#L358). Here, we set every piece of the call by hand and we have no help from the compiler (to tell us whether we use correct arguments or if the return type is valid). This manual approach gives contract author access to ink!-level [errors](https://docs.rs/ink_env/3.4.0/ink_env/enum.Error.html) which gives an option to recover from the low-level failures.
2) Using the macro-generated `*Ref` pattern. An example of that is [`delete_highlight`](./bulletin_board/lib.rs#L390). This approach is type-safe but doesn't allow for transferring tokens with the call. At least not currently.

Both approaches, if done correctly, provide a typed access to another contract.

### test a cross-contract call

### build your local contract with optimizations

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

### deploy a contract using Contracts UI

#### Prerequisities for interacting with Aleph Zero Testnet

1. Install PolkadotJS browser extension.
2. Create new account.
3. Fund the account via Aleph Zero TestNet fauce - https://faucet.test.azero.dev/.

#### Prerequisities for interacting with Local Node

1. Spin up the local network [#TODO link to the guide]
2. Import Alice's key to PolkadotJS browser extension [#TODO howto]

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

## Concepts NOT covered in this example

### Usage of OpenBrush library

[OpenBrush](https://openbrush.io/) is a set of libraries created by Supercolony (a very competent team that works with the Parity team on ink!) that tries to cover the places where ink! may be too "raw" for some developers. You may think about it as [OpenZeppelin in ink!](https://medium.com/supercolony/ink-has-most-of-the-features-required-for-usage-however-the-usability-of-ink-is-low-95f4bc974e22).

This is a wide set of tools which, in some cases (like contract traits and other macros), replaces native ink! tooling. This particular template is meant to help developers bootstrap with ink! and leaves the extension to the developer.

### What is `#[ink::trait_definition]` and how to use it.
### How to upgrade a smart contract.