// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract CoolNFT is ERC721, ERC721Enumerable, ERC721URIStorage  {
    using Counters for Counters.Counter;
        uint256 MAX_SUPPLY = 100000;
        uint256 MAX_LIMIT = 2 ;
        mapping(address => uint8) private mintedAddress;


    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("CoolNFT", "CFT") {}

    function safeMint(address to) public  {
        require(_tokenIdCounter.current() <= MAX_SUPPLY, "I'm sorry we reached the cap");
        require( mintedAddress[msg.sender] < MAX_LIMIT,"You have exceeded minting limit");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        mintedAddress[msg.sender] += 1;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, 'https://ipfs.filebase.io/ipfs/QmRaNix1JNjT4p1zwXQRPpEWPfZ5XJqknbSuCGLsYztDfN');
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
