// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBase {
    event Received(address, uint256);

    receive() external payable;

    function withdraw(address to, uint256 value) external payable;
}
