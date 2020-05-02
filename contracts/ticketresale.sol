pragma solidity >=0.5.0 <0.6.0;


import "./ticketownership.sol";

contract TicketResale is TicketOwnership{


    constructor (uint _sellingTime, address payable _owner, uint _price, uint _availableTickets) public {
        availableTickets = _availableTickets;
        price = _price*1 ether;
        venue_owner = _owner;
        sale_start=now;
        sale_end = sale_start + _sellingTime*1  seconds;
        STATE=sale_state.STARTED;
    }

    uint[] private resale_Tickets;
    mapping (uint => uint) public ticketToPrice;
    mapping (uint => uint) public ticketToIndex;

    modifier onlyMyTickets(uint[] memory my_tix){
        for(uint i = 0; i < my_tix.length; i++){
            require(ticketToOwner[my_tix[i]] == msg.sender, "One of the tickets is not yours, or does not exist");
        }
        _;
    }

    function list_2ndHand_tickets() public view returns (uint[] memory){
        return resale_Tickets;
    }

    function buy_from_reseller(uint[] memory number_tickets) public payable returns (bool){
        uint resale_price = 0;
        for(uint i = 0 ; i < number_tickets.length; i++){
            resale_price += ticketToPrice[number_tickets[i]];
        }
        resale_price = resale_price * 1 wei;
        require(msg.value == resale_price, "You do not have enough ether");
        for(uint i = 0 ; i < number_tickets.length; i++){
            address payable seller = address(uint160(ticketToOwner[number_tickets[i]]));
            seller.transfer(ticketToPrice[number_tickets[i]] * 1 wei);
            transferFrom(ticketToOwner[number_tickets[i]], msg.sender, number_tickets[i]);
            adjust_resale_array(ticketToIndex[number_tickets[i]]);
            delete ticketToIndex[number_tickets[i]];
            delete ticketToPrice[number_tickets[i]];
        }
        return true;
    }

    function adjust_resale_array(uint index) internal returns(bool){
        resale_Tickets[index] = resale_Tickets[resale_Tickets.length-1];
        delete resale_Tickets[resale_Tickets.length-1];
        return true;
    }

    function list_my_tickets() public view returns (int[]  memory){
        int[] memory my_tickets = new int[](ownerTicketCount[msg.sender]);
        uint j = 0;
        for(int i = 0; i < int(tickets.length); i++){
            if(ticketToOwner[uint(i)] == msg.sender){
                my_tickets[j] = i;
                j+=1;
            }
        }
        return my_tickets;
    }

    function sell_my_tickets(uint[] memory my_tickets, uint my_price) onlyMyTickets(my_tickets) public returns (bool){
        require(ownerTicketCount[msg.sender] >= my_tickets.length, "You do not have as many tickets to sell");
        for(uint i = 0; i < my_tickets.length; i++){
            ticketToPrice[my_tickets[i]] = my_price;
            uint indx = resale_Tickets.push(my_tickets[i]) - 1;
            ticketToIndex[my_tickets[i]] = indx;
        }
    }

    function cancel_my_sale(uint[] memory my_tickets) onlyMyTickets(my_tickets) public returns (bool){
        for(uint i = 0; i < my_tickets.length; i++){
            delete ticketToPrice[my_tickets[i]];
        }
    }
}