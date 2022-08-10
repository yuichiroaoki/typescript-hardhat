// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract VaultBase is Ownable, ReentrancyGuard {
    event ReceiveEth(address from, uint256 value);
    event WithdrawEth(address token, uint256 value);

    receive() external payable {
        emit ReceiveEth(msg.sender, msg.value);
    }

    function withdrawEth(address to, uint256 value)
        external
        payable
        onlyOwner
        nonReentrant
    {
        require(getBalance() >= value, "No balance to withdraw");
        TransferHelper.safeTransferETH(to, value);
        emit WithdrawEth(to, value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
