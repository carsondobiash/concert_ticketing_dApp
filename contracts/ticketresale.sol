pragma solidity >=0.5.0 <0.6.0;

import "./erc721.sol";
import "./safemath.sol";
import "./ticketfactory.sol";

contract TicketResale is TicketFactory, ERC721 {

constructor (uint _sellingTime, address _owner, uint _price, uint _availableTickets) public {
        availableTickets = ownerTicketCount[msg.sender];
        price = _price*1 ether;
        venue_owner = _owner;
        sale_start=now;
        sale_end = sale_start + _sellingTime*10  minutes;
        STATE=sale_state.STARTED;
    }

    modifier onlyOwnerOf(uint _ticketId) {
        require(msg.sender == ticketToOwner[_ticketId]);
        _;
    }

    modifier an_ongoing_sale(){
        require(now <= sale_end);
        _;
    }

    modifier only_buyer(){
        require(msg.sender==buyer);
        _;
    }

    //Add number of tickets to be an argument
    function buy_resale() public payable an_ongoing_sale returns (bool){
        buyer = msg.sender;
        number_tickets = msg.value;

        return true;
    }


    function cancel_resale() external onlyOwnerOf an_ongoing_sale returns (bool){
        STATE=sale_state.CANCELLED;
        sale_end = now;
        return true;
    }

    function resell() external only_buyer payable{
        require(now < sale_end || STATE != sale_state.CANCELLED);
        address payable _sale_owner = address(uint160(venue_owner));

        _sale_owner.transfer(price * number_tickets);

        address payable current = address(uint160(msg.sender));
        //Need help here figuring out the transfer of the actual tickets
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerTicketCount[_owner];
    }
}