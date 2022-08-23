// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '@chainlink/contracts/src/v0.7/ChainlinkClient.sol';
//import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

contract APIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    bytes32 public data;
    bytes32 private jobId;
    uint256 private fee;
    address private oracle;
    string public urlToAPI;
    string public pathToAssetId;

    constructor(address _link, bytes32 _jobid, address _oracle, uint256 _fee, string memory _urlToAPI, string memory _pathToAssetId){
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        oracle = _oracle;
        jobId = _jobid;
        fee = _fee;
        urlToAPI = _urlToAPI;
        pathToAssetId = _pathToAssetId;
    }

    function requestData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add('get', urlToAPI);
        req.add('path', pathToAssetId);
        return sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, bytes32 _data) public recordChainlinkFulfillment(_requestId) {
        data = _data;
    }

    function withdrawLink() public {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }
   

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

}

