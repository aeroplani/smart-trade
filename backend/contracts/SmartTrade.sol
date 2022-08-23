// SPDX-License-Identifier: MIT

// 1. Pragma
pragma solidity ^0.7.0;

import "@chainlink/contracts/src/v0.7/interfaces/KeeperCompatibleInterface.sol";
import "./interfaces/IAPIConsumer.sol";
import "@chainlink/contracts/src/v0.7/ChainlinkClient.sol";
//import "contracts/APIConsumer.sol";

contract SmartTrade is KeeperCompatibleInterface, ChainlinkClient {

    // State variables
    address private immutable address_buyer;
    address private address_seller;
    address public address_APIConsumer;

    uint256 private immutable i_contractDuration;
    uint256 private immutable i_intervalApiCheck;
    uint256 private s_firstTimeStamp;
    uint256 private s_lastTimeStamp;
    
    mapping(address => uint256) private s_addressToAmountFunded;
    
    //bytes32 public assetOwnerId;
    bytes32 public buyerId;
    //bool public assetTransferSucess = false;
    uint256 price;

    constructor(
        address _address_APIConsumer,
        address _address_seller,
        string memory _buyerId,
        uint256 _price) {
        
        address_buyer = msg.sender;
        address_seller = _address_seller;
        price = _price;
                
        buyerId = stringToBytes32(_buyerId);
        address_APIConsumer = _address_APIConsumer;
        
        i_contractDuration = 20;
        i_intervalApiCheck = 5;
        s_firstTimeStamp = block.timestamp;
        s_lastTimeStamp = block.timestamp;
    }


    function fund() public payable {
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    // removed view
    function checkUpkeep(bytes memory /* checkData */) public view override returns (bool upKeepNeeded, bytes memory performData) {
  
        bytes32 assetOwnerId = IAPIConsumer(address_APIConsumer).data();
        bool assetTransferSucess = (buyerId == assetOwnerId);    
    
        bool hasBalance = address(this).balance >= price;
        bool transactionSuccessfull = (hasBalance && assetTransferSucess);
        bool is_contract_alive = ((block.timestamp - s_firstTimeStamp) < i_contractDuration);
        upKeepNeeded = (transactionSuccessfull || !is_contract_alive);
        performData = abi.encode(transactionSuccessfull, is_contract_alive);
        return (upKeepNeeded, performData);
    }

    function performUpkeep(bytes calldata performData ) external override {
        //(bool upKeepNeeded, bytes memory  performData ) = checkUpkeep("");
        (bool transactionSuccessfull, bool is_contract_alive) = abi.decode(performData, (bool, bool));
        // end of contract
        if (transactionSuccessfull) {
            address_seller.call{value: address(this).balance}("");
        }

        //
        else if (!is_contract_alive) {
            address_buyer.call{value: address(this).balance}("");
        }
    }
    
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function getAddressToAmountFunded(address fundingAddress) public view returns (uint256) {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractDuration() public view returns (uint256) {
        return i_contractDuration;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getBuyerId() public view returns (bytes32) {
        return buyerId;
    }

    function getAPIConsumerAddress() public view returns (address) {
        return address_APIConsumer;
    }

    function getData() public view returns (bytes32) {
        return IAPIConsumer(address_APIConsumer).data();
        
    }
}