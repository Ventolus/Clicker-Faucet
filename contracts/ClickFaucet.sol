// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClickFaucet is Ownable {
    IERC20 public clickToken;
    uint256 public faucetAmount = 5 * 10 ** 18;
    mapping(address => uint256) public lastClaimed;

    constructor(address _token) Ownable(msg.sender) {
        clickToken = IERC20(_token);
    }

    // ✅ Users can claim once per minute (change to 1 days later)
    function claim() external {
        require(block.timestamp - lastClaimed[msg.sender] >= 1 minutes, "You can only claim once per minute");
        require(clickToken.balanceOf(address(this)) >= faucetAmount, "Faucet empty");

        lastClaimed[msg.sender] = block.timestamp;
        clickToken.transfer(msg.sender, faucetAmount);
    }

    // ✅ Owner can top up the faucet
    function topUpFaucet(uint256 amount) external onlyOwner {
        clickToken.transferFrom(msg.sender, address(this), amount);
    }

    // ✅ Owner can withdraw tokens from the faucet
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        clickToken.transfer(to, amount);
    }

    // ✅ Frontend uses this to show countdown timer
    function nextClaimTimestamp(address user) external view returns (uint256) {
        return lastClaimed[user] + 1 minutes;
    }
}
