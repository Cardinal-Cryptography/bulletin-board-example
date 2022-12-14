# Exemplary frontend for the Bulletin Board contracts

In this folder you will find fronted for the Bulletin Board contracts from `../contracts` directory.

The purpose is to show dApp developers an example where users are able to both send signed transactions to blockchain (using their PolkadotJS extension wallet) and read contract data through node's RPC.
<p align="middle">
  <img src="https://user-images.githubusercontent.com/95355183/207668145-7f371d3d-6e5d-45fb-823b-9d15404a3ce8.png" width=45%/> 
  <img src="https://user-images.githubusercontent.com/95355183/207668186-d1048df0-df90-41e2-a673-f6e61b04c291.png" width=45%/>
</p>
<p align="middle">
  <img src="https://user-images.githubusercontent.com/95355183/207668236-4b8d8a65-2f0d-4e1a-a4fc-1efe92a0e33e.png" width=45%/>
  <img src="https://user-images.githubusercontent.com/95355183/207669773-8bb89466-f5b8-4d0c-8090-ddb8e80da8b0.png" width=45%/>
</p>
<p align="middle">
  <img src="https://user-images.githubusercontent.com/95355183/207671162-bf8173b9-fa7c-4b9f-a42e-e38378abf836.png" width=45%/>
  <img src="https://user-images.githubusercontent.com/95355183/207671202-7b4c5987-a7e0-4e3a-ac98-4c44726e6f81.png" width=45%/>
</p>



## What kind of batteries are included?

The fronted is written using Aleph Zero branding (colors, icons, fonts), so that you can build your own contract with suggested UI elements from the get go.

In this repository, you will find:
1. How to connect frontend to a deployed contract. 
2. How to integrate with PolkadotJS wallet extension. See `AccountSelector` and `WalletButton` components.
3. Popups - `WelcomePopup` component.
4. Footer - `Footer` component.
5. How to send signed transactions - `sendPost.ts` and `deletePost.ts` files.
6. How to query RPC endpoint - various `get*.ts` files in `/src/utils/` folder.

## How to run?

### Prerequisities

Before we start running the frontend we have to:
* deploy set of examplary contracts to _a_ network
* record their addresses in `/src/metadata/addresses.json` file.
* update `/src/metadata/metadata_*.json` files to be up-to-date with the metadata of contracts we will be interacting with. This is necessary as the metadata files include contract's API specification - argument and return types, method names (selectors), etc. If our metadata files aren't up-to-date we will fail to send txn or read from the node's RPC.

**NOTE**: Addresses and metadata included in the repository should be replaced before usage.

Please consult README from `../contracts/` directory.

--------------
The fronted expects only one env variable to be set: `REACT_APP_PROVIDER_URL` - that is a websocket address of the node you wish to connect to:
* local development is usually `REACT_APP_PROVIDER_URL=ws://localhost:9944`.
* testnet: `REACT_APP_PROVIDER_URL=wss://ws.test.azero.dev`.
* at the time of writing this document, contracts pallet was not yet deployed to Aleph Zero Mainnet.

To run the server and connect to local node, simply execute:
```bash
export REACT_APP_PROVIDER_URL=ws://localhost:9944 && npm start
```

## How do we intend for people to use this?

The example should be self-contained - i.e. together with the examplary contracts they form a concerete use case but we tried to make the code simple to follow and also put some placeholders in more interesting places so that devs can put their own designs there.

Feel free to clone the repository and play with it until it matches what you're building!

--------
### Happy Hacking!
**Aleph Zero team**
