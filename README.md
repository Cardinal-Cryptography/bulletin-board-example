## Concepts covered in this example:
* How to emit events from a contract.
* How to write a test asserting the events were emitted.
* How to add debug logging to your contract.
* Multiple constructors for a contract.
* How to store custom data in `ink!` storage.
* How to transfer tokens as part of a contract call.
* How to unit test a smart contract.
* How to terminate a contract and what does it mean.
* When to use `panic!`/`assert!` and when return a `Result`.
* What are selectors and how to use them.
* How to call another contract and handle the response.
* How to test cross-contract calls.
* How to build a contract and optimize it.
* How to deploy a contract using Contracts UI. And interact with it.
* How to deploy a contract to custom environment.
* Various comments through the code of the contract that try to cover basic ink!-specific constructs.

### How to build your local contract with optimizations

### How to deploy a contract using Contracts UI

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

For more information about the **Contracts UI** you can consult the official documentation: https://use.ink/getting-started/deploy-your-contract

## Concepts NOT covered in this example

### Usage of OpenBrush library

[OpenBrush](https://openbrush.io/) is a set of libraries created by Supercolony (a very competent team that works with the Parity team on ink!) that tries to cover the places where ink! may be too "raw" for some developers. You may think about it as [OpenZeppelin in ink!](https://medium.com/supercolony/ink-has-most-of-the-features-required-for-usage-however-the-usability-of-ink-is-low-95f4bc974e22).

This is a wide set of tools which, in some cases (like contract traits and other macros), replaces native ink! tooling. This particular template is meant to help developers bootstrap with ink! and leaves the extension to the developer.

### What is `#[ink::trait_definition]` and how to use it.
### How to upgrade a smart contract.