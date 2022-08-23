const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig, pathToAssetId, buyerId } = require("../../helper-hardhat-config")
const { assert, expect } = require('chai')
const web3 = require("web3")

describe('smartTrade', async function () {
  let smartTrade
  let linkToken
  let mockOracle
  let apiConsumer
  beforeEach(async function (){

    await deployments.fixture(["mocks", "apiConsumer", "smartTrade"])
    smartTrade = await ethers.getContract('SmartTrade')
    linkToken = await ethers.getContract("LinkToken")
    mockOracle = await ethers.getContract("MockOracle")
    apiConsumer = await ethers.getContract("APIConsumer")
    
    linkTokenAddress = linkToken.address
    additionalMessage = ` --linkaddress  ${linkTokenAddress}`
    await linkToken.transfer(apiConsumer.address, '2000000000000000000')

    accounts = await ethers.getSigners()
    buyerAccount = accounts[0]
    sellerAccount = accounts[1]
    buyerOriginalBalance = await buyerAccount.getBalance()
    sellerOriginalBalance = await sellerAccount.getBalance()

    price =  ethers.BigNumber.from(await smartTrade.getPrice())
  })

  describe("Funding contract", function () {
    it("Funds contract correctly", async () => {
      await smartTrade.fund({ value: price })
      const contractBalance = await smartTrade.getContractBalance()
      assert.equal(contractBalance.toString(), price.toString())
    })
  })

  describe("CheckUpkeep", function () {
    it("No upkeep when under funded", async () => {
      //await smartTrade.fund({ value: price - 1})

      const transaction = await apiConsumer.requestData()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]
      const returnData = web3.utils.padRight(web3.utils.padLeft(web3.utils.toHex(buyerId)), 64)
      const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
      await tx.wait()

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      let upkeepNeeded = _checkUpkeep[0]
      assert(!upkeepNeeded)
    })

    it("Upkeep when contract duration expire ", async () => {
      await smartTrade.fund({ value: price + 1})
      contractDuration = await smartTrade.getContractDuration()
      
      const transaction = await apiConsumer.requestData()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]
      const returnData = web3.utils.padRight(web3.utils.padLeft(web3.utils.toHex(buyerId)), 64)
      const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
      await tx.wait()

      await network.provider.send("evm_increaseTime", [contractDuration.toNumber() + 1])
      await network.provider.request({ method: "evm_mine", params: [] })

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      let upkeepNeeded = _checkUpkeep[0]
      assert(upkeepNeeded)
    })

    it("Upkeep when all conditions for a trade are met", async () => {
      await smartTrade.fund({ value: price})

      const transaction = await apiConsumer.requestData()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]
      const returnData =  web3.utils.padRight(web3.utils.padLeft(web3.utils.toHex(buyerId)), 64)
      const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
      await tx.wait()

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      let upkeepNeeded = _checkUpkeep[0]
      assert(upkeepNeeded)
    })
  })
  
  describe("PerformUpkeep", function () {

    it("Keeps funds while waiting for ownership transfer", async () => {
      await smartTrade.fund({ value: price })

      const transaction = await apiConsumer.requestData()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]
      const returnData =  web3.utils.padRight(web3.utils.padLeft(web3.utils.toHex(buyerId+'0')), 64)
      const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
      await tx.wait()

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      await smartTrade.performUpkeep(_checkUpkeep[1])
      contractBalance = await smartTrade.getContractBalance()
      assert.equal(contractBalance.toLocaleString(), price)
    })

    it("Delivers money after successfull transaction", async () => {
      await smartTrade.fund({ value: price })

      const transaction = await apiConsumer.requestData()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]
      const returnData =  web3.utils.padRight(web3.utils.padLeft(web3.utils.toHex(buyerId)), 64)
      const tx = await mockOracle.fulfillOracleRequest(requestId, returnData)
      await tx.wait()

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      await smartTrade.performUpkeep(_checkUpkeep[1])

      contractBalance = await smartTrade.getContractBalance()
      sellerNewBalance = await sellerAccount.getBalance() 
      assert.equal(contractBalance.toLocaleString(), 0)
      expect(parseInt(sellerNewBalance)).to.be.greaterThan(parseInt(sellerOriginalBalance))
    })

    it("Refund when contract expires", async () => {
      await smartTrade.fund({ value: price })

      await network.provider.send("evm_increaseTime", [contractDuration.toNumber() + 1])
      await network.provider.request({ method: "evm_mine", params: [] })

      let _checkUpkeep = await smartTrade.callStatic.checkUpkeep("0x")
      await smartTrade.performUpkeep(_checkUpkeep[1])
      contractBalance = await smartTrade.getContractBalance()
      console.log(contractBalance.toLocaleString())
      assert.equal(contractBalance.toLocaleString(), 0)
    })
  })
})  