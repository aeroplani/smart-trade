const { expect } = require('chai')
const web3 = require("web3")

describe('APIConsumer', async function () {
  let apiConsumer, mockOracle, linkToken

  beforeEach(async () => {
    await deployments.fixture(['mocks', 'apiConsumer'])

    // Then, we can get the contracts like normal
    const LinkToken = await deployments.get('LinkToken')
    const APIConsumer = await deployments.get('APIConsumer')
    const MockOracle = await deployments.get('MockOracle')
    
    apiConsumer = await ethers.getContractAt('APIConsumer', APIConsumer.address)
    mockOracle = await ethers.getContractAt('MockOracle', MockOracle.address)
    linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
    
    await linkToken.transfer(apiConsumer.address, '2000000000000000000')
  })

  it("Should successfully make an API request", async () => {
    const transaction1 = await apiConsumer.requestData()
    const transactionReceipt = await transaction1.wait(1)
    const requestId1 = transactionReceipt.events[0].topics[1]
    expect(requestId1).to.not.be.null
  })

  it('Should successfully make an external API request', async () => {
    const expected = 'abcdefg'
    const transaction = await apiConsumer.requestData()
    const tx_receipt = await transaction.wait()
    const requestId = tx_receipt.events[0].topics[1]
    const returnData = web3.utils.padLeft(web3.utils.padRight(web3.utils.toHex(expected)), 64)
    const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
    await tx.wait()
    expect(await apiConsumer.data()).to.equal(returnData)
  })
})
