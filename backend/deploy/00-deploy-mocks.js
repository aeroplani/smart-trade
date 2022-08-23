module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();
    
    if (chainId == 31337) {
      log("Local network detected! Deploying mocks...");
      const linkToken = await deploy("LinkToken", { from: deployer, log: true });
      await deploy("MockOracle", {
        from: deployer,
        log: true,
        args: [linkToken.address],
      });
      log("Mocks Deployed!");
    }
  };
  module.exports.tags = ["all", "mocks"];
  