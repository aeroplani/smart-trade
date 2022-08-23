const networkConfig = {
    31337: {
        name: "localhost",
        linkToken: '0xa36085F69e2889c224210F603D836748e7dC0088',
        oracle: '0xAA1DC356dc4B18f30C347798FD5379F3D77ABC5b',
        jobId: '7d80a6386ef543a3abb52817f6707e3b',
        fee: '100000000000000000',
    },
    4: {
        name: "rinkeby",
        linkToken: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
        oracle: '0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f',
        jobId: '7d80a6386ef543a3abb52817f6707e3b',
        fee: '100000000000000000',
    },
}
const developmentChains = ["hardhat", "localhost"]
const getNetworkIdFromName = async (networkIdName) => {
    for (const id in networkConfig) {
      if (networkConfig[id]["name"] == networkIdName) {
        return id;
      }
    }
    return null;
  };

  const urlToAPI = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD'
  const pathToAssetId = 'RAW,ETH,USD,LASTMARKET'
  const buyerId = 'a'
  const price =  "10000000000000000000"

module.exports = {
    networkConfig,
    developmentChains,
    getNetworkIdFromName,
    urlToAPI,
    pathToAssetId,
    buyerId,
    price,
}
