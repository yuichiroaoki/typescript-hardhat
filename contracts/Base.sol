// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IBase.sol";

contract Base is ReentrancyGuard, Ownable, IBase {
    uint256 private storedValue;

    receive() external payable override {
        emit Received(msg.sender, msg.value);
    }

    function setStoredValue(uint256 newValue) external {
        storedValue = newValue;
    }

    function getStoredValue() external view returns (uint256) {
        return storedValue;
    }

    function withdraw(address to, uint256 value)
        external
        payable
        override
        onlyOwner
        nonReentrant
    {
        (bool sent, ) = to.call{value: value}("");
        require(sent, "Failed to send Ether");
    }
}
