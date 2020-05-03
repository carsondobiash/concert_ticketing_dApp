pragma solidity >=0.5.0 <0.6.0;

import "./erc721.sol";
import "./safemath.sol";
// import "./ticketresale.sol";
import "./ticketfactory.sol";

/// TODO: Replace this with natspec descriptions
contract TicketOwnership is TicketFactory, ERC721 {


    using SafeMath for uint256;

    mapping (uint => address) zombieApprovals;

    modifier onlyOwnerOf(uint _ticketId) {
        require(msg.sender == ticketToOwner[_ticketId]);
        _;
    }

    modifier an_ongoing_sale(){
        require(now <= sale_end);
        _;
    }

    //Change to cancael_sale
    function cancel_sale() external an_ongoing_sale returns (bool){
        STATE=sale_state.CANCELLED;
        sale_end = now;
        emit CanceledEvent("Auction Cancelled", now);
        return true;
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

    function transferFrom(address _from, address _to, uint256 _tokenId) public payable{
        _transfer(_from, _to, _tokenId);
    }

}
