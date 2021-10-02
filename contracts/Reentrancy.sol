// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract Reentrancy is ReentrancyGuard, Ownable {
    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function withdraw(address to, uint256 value)
        public
        payable
        onlyOwner
        nonReentrant
    {
        (bool sent, ) = to.call{value: value}("");
        require(sent, "Failed to send Ether");
    }
}

contract ReentrancyUpgradeable is
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable
{
    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function initialize() external initializer {
        __Ownable_init();
    }

    function withdraw(address to, uint256 value)
        public
        payable
        onlyOwner
        nonReentrant
    {
        (bool sent, ) = to.call{value: value}("");
        require(sent, "Failed to send Ether");
    }
}
