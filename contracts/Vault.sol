// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/VaultBase.sol";

contract Vault is VaultBase {
    event WithdrawErc20(address token, address to, uint256 amount);

    function withdrawErc20(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(
            IERC20(token).balanceOf(address(this)) > 0,
            "No balance to withdraw"
        );
        TransferHelper.safeTransfer(token, to, amount);
        emit WithdrawErc20(token, to, amount);
    }
}
