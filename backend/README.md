## SmartTrade

This project was built to make vehicle trades trustless. In short, the work flow of the trade goes as follow:
1. Buyer funds contract with the agreed upon price
2. Seller transfers ownership of vehicle to buyer
3. Contract picks up the transfer of ownershiip and releases its funds to the buyer.

If the transfer of ownership is not assigned to the buyer within 24 hours. Funds will be sent back to the seller.

## Installation

Set your `RINKEBY_RPC_URL` and `PRIVATE_KEY` in your `.env` file. Dependencies can be installed using yarn lock through 

```bash
yarn
```

## Deploy

Deployment scripts are in the [deploy](https://github.com/pappas999/chainlink-hardhat-box/tree/main/deploy) directory.
Default network for deployments is the local hardhat network. To deploy to default network:

```bash
hh deploy 
```

To deploy to testnet:
```bash
hh deploy --network rinkeby
```

## Test
Tests are located in the [test](https://github.com/pappas999/chainlink-hardhat-box/tree/main/test) directory and can be modified as required. To run them use:

```bash
hh test
```