pragma solidity >=0.5.0 <0.6.0;

import "./ownable.sol";
import "./safemath.sol";
import "./erc721.sol";

contract TicketFactory is Ownable {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint public availableTickets;
    address payable internal venue_owner;
    uint256 public sale_start;
    uint256 public sale_end;
    uint public price;

    enum sale_state{
        CANCELLED,STARTED
    }
    sale_state public STATE;

    event NewTicket(uint dna);
    event Transfer(address from, address to, uint256 tokenId);
    event CanceledEvent(string message, uint256 time);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;


    struct Ticket {
        uint dna;
    }

    Ticket[] public tickets;

    mapping (uint => address) ticketToOwner;
    mapping (address => uint[]) ownerToTickets;
    mapping (address => uint) ownerTicketCount;

    function _createTicket(uint _dna) internal {
        uint id = tickets.push(Ticket(_dna)) - 1;
        ticketToOwner[id] = msg.sender;
        ownerToTickets[msg.sender].push(id);
        ownerTicketCount[msg.sender] = ownerTicketCount[msg.sender].add(1);
        emit NewTicket(_dna);
    }

    function _generateRandomDna(string memory _str, uint number) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str, number)));
        return rand % dnaModulus;
    }

    function _buyTickets(string memory _name, uint numberOfTickets) payable public {
        require(now < sale_end, "Sorry we are not selling anymore");
        require(availableTickets > 0, "Sorry we are sold out.");
        require(int(availableTickets - numberOfTickets) >= 0, "We dont have that many tickets available");
        require(msg.value >= price*numberOfTickets, "Non-negotiable price");

        for(uint i = 0; i < numberOfTickets; i++){
            uint randDna = _generateRandomDna(_name, availableTickets);
            availableTickets = availableTickets-1;
            randDna = randDna - randDna % 100;
            _createTicket(randDna);
            address(venue_owner).transfer(msg.value);
        }


    }

    function getMyTicketCount(address myAddress) public view returns(uint){
        return ownerTicketCount[myAddress];
    }

    function getMyTicketIds(address myAddress) public view returns(uint[] memory){
        return ownerToTickets[myAddress];
    }

    function getAllTicketInfo() public view returns(uint, address, uint256, uint256, uint) {
            return (availableTickets, venue_owner, sale_start, sale_end, price);
    }
}
