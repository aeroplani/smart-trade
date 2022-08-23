const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains, buyerId, price } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    
    const { deploy, log } = deployments
    const { deployer, seller } = await getNamedAccounts()

    const apiConsumer = await ethers.getContract("APIConsumer", deployer) 
    const smartTrade = await deploy("SmartTrade", {
        from: deployer,
        args: [
            apiConsumer.address,
            seller,
            buyerId,
            price],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Using APIConsumer deployed at ${apiConsumer.address}`)
    log(`SmartTrade deployed at ${smartTrade.address}`)
}

module.exports.tags = ["all", "smartTrade"]