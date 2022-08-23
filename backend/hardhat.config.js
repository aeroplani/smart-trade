require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
require("./tasks/fund-link")
require("./tasks/api-consumer/request-data")
require("./tasks/api-consumer/read-data")
require("./tasks/accounts")
require("./tasks/balance")
require('@nomiclabs/hardhat-truffle5');
//require('web3')

require("dotenv").config();

module.exports = {
    pathAssetId: 'RAW,ETH,USD,LASTMARKET',
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            gasPrice: 130000000000,
            gas: 2100000,
            gasPrice: 8000000000,
        },
        localhost: {
            url: 'http://127.0.0.1:8545/',
            chainId: 31337,
            gas: 2100000,
            gasPrice: 8000000000,
        },
        rinkeby: {
            url: process.env.RINKEBY_RPC_URL,
            accounts: [process.env.PRIVATE_KEY ],
            chainId: 4,
            blockConfirmations: 6,
            gas: 6000000,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.7.0",
              },
              {
                version: "0.6.6",
              },
              {
                version: "0.4.24",
              },
        ],
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0, 
        },
        seller:{
            default: 1,
        },
    },
}
