// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

interface IAPIConsumer {
  function requestData() external view returns (bytes32);  
  function data() external view returns (bytes32);
}


