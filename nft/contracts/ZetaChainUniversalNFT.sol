// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZetaChainUniversalNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public ticketPrice = 0.01 ether; // Set your ticket price
    string public baseTokenURI;

    event TicketMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(string memory _baseTokenURI) ERC721("ZetaTicket", "ZTIX") Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
    }

    function mintTicket() public payable {
        require(msg.value >= ticketPrice, "Insufficient payment");
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        string memory uri = string(abi.encodePacked(baseTokenURI, uint2str(tokenId), ".json"));
        _setTokenURI(tokenId, uri);
        emit TicketMinted(msg.sender, tokenId, uri);
        nextTokenId++;
    }

    // Withdraw collected funds
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Helper to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}
