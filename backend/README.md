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