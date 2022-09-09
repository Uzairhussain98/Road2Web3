// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    event NewMemo(address from, uint256 timestamp, string name, string message);

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos recieved from friends
    Memo[] memos;

    address payable owner;

    //Constructor is only run when the contract is deployed
    constructor() {
        owner = payable(msg.sender);
    }

    /* 
    @dev buy coffee for a contact owner
    @param _name name of the cofee buyer
    @param _message message of the cofee buyer 
    */

    function BuyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, " Can't buy coffee with 0 eth");

        // Add the memo to the list of memos
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        //Emit a log event when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /* 
    @dev send all the funds to the owner 
    */
    function WithDrawTips() public {
        require(owner.send(address(this).balance));
    }

    /* 
    @dev retrive all the memos stored on the blockchain
    */
    function GetMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
