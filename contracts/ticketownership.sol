pragma solidity >=0.5.0 <0.6.0;

import "./erc721.sol";
import "./safemath.sol";
import "./ticketfactory.sol";

/// TODO: Replace this with natspec descriptions
contract TicketOwnership is TicketFactory, ERC721 {

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
