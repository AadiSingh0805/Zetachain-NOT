// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../contracts/ZetaChainUniversalNFT.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        ZetaChainUniversalNFT nft = new ZetaChainUniversalNFT(
            "https://api.example.com/metadata/"
        );
        
        console.log("NFT deployed to:", address(nft));
        
        vm.stopBroadcast();
    }
}
