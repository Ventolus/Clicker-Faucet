// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ClickerGame {
    mapping(address => uint256) public playerClicks;
    mapping(address => uint256) public startTimes;
    mapping(address => bool) public isTopPlayer;

    address[] public topPlayers;
    uint256 public timeLimit = 30; // seconds
    bool public gameStarted;

    function startGame() public {
        require(!gameStarted, "Game already started");
        startTimes[msg.sender] = block.timestamp;
        playerClicks[msg.sender] = 0;
        gameStarted = true;
    }

    function click() public {
        require(gameStarted, "You must start the game first");
        require(block.timestamp <= startTimes[msg.sender] + timeLimit, "Time's up!");

        playerClicks[msg.sender]++;

        if (!isTopPlayer[msg.sender]) {
            topPlayers.push(msg.sender);
            isTopPlayer[msg.sender] = true;
        }
    }

    function getTopPlayers() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory scores = new uint256[](topPlayers.length);
        for (uint256 i = 0; i < topPlayers.length; i++) {
            scores[i] = playerClicks[topPlayers[i]];
        }
        return (topPlayers, scores);
    }

    function resetScore() public {
        playerClicks[msg.sender] = 0;
        startTimes[msg.sender] = 0;
        gameStarted = false;
        isTopPlayer[msg.sender] = false;
    }

    function getScore(address player) public view returns (uint256) {
        return playerClicks[player];
    }

    function getStartTime(address player) public view returns (uint256) {
        return startTimes[player];
    }

    function isPlaying(address player) public view returns (bool) {
        return gameStarted && block.timestamp <= startTimes[player] + timeLimit;
    }
}
