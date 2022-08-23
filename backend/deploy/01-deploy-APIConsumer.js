const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains, urlToAPI, pathToAssetId } = require("../helper-hardhat-config")
const web3 = require("web3")
module.exports = async ({ getNamedAccounts, deployments }) => {
    
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let linkTokenAddress;
    let oracle;
    let additionalMessage = "";

    if (chainId == 31337) {
        linkToken = await get("LinkToken");
        MockOracle = await get("MockOracle");
        linkTokenAddress = linkToken.address;
        oracle = MockOracle.address;
        additionalMessage = " --linkaddress " + linkTokenAddress;
        log(`Using LinkToken deployed at ${linkToken.address}`)
        log(`Using MockOracle deployed at ${MockOracle.address}`)
    } 
    else {
        linkTokenAddress = networkConfig[chainId]["linkToken"];
        oracle = networkConfig[chainId]["oracle"];
    }
    const jobId = web3.utils.toHex(networkConfig[chainId]["jobId"]);
    const fee = networkConfig[chainId]["fee"];
    const apiConsumer = await deploy("APIConsumer", {
        from: deployer,
        args: [linkTokenAddress, jobId, oracle, fee, urlToAPI, pathToAssetId],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log(`APIConsumer deployed at ${apiConsumer.address}`)
    
    log("Run the following command to fund contract with LINK:");
    log(
        "hh fund-link" +  
        " --contract " + apiConsumer.address +
        " --network " + networkConfig[chainId]["name"] +
        additionalMessage
    );
};


module.exports.tags = ["all", "apiConsumer"]