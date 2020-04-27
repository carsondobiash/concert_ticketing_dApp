pragma solidity >=0.5.0 <0.6.0;

import "./erc721.sol";
import "./safemath.sol";
import "./ticketfactory.sol";

/// TODO: Replace this with natspec descriptions
contract TicketOwnership is TicketFactory, ERC721 {

    address public buyer;
    uint256 public number_tickets;

    using SafeMath for uint256;

    constructor (uint _sellingTime, address _owner, uint _price, uint _availableTickets) public {
        availableTickets = _availableTickets;
        price = _price*1 ether;
        venue_owner = _owner;
        sale_start=now;
        sale_end = sale_start + _sellingTime*10  minutes;
        STATE=sale_state.STARTED;
    }

    mapping (uint => address) zombieApprovals;

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

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return ticketToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerTicketCount[_to] = ownerTicketCount[_to].add(1);
        ownerTicketCount[msg.sender] = ownerTicketCount[msg.sender].sub(1);
        ticketToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        // require (ticketToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
        require (ticketToOwner[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}
